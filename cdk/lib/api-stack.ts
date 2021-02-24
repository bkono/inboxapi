import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";
import * as path from "path";

export class ApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, "InboxApi", {
      name: "InboxApi",
      schema: appsync.Schema.fromAsset(
        path.join(__dirname, "../..", "schemas", "api.graphql")
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
      },
    });

    new cdk.CfnOutput(this, "InboxApiUrl", {
      value: api.graphqlUrl,
    });
    new cdk.CfnOutput(this, "InboxApiKey", {
      value: api.apiKey || "",
    });

    const inboxFn = new lambda.Function(this, "InboxApiFn", {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(
        path.join(__dirname, "../..", "lambdas", "inbox", "dist")
      ),
    });

    // Set the new Lambda function as a data source for the AppSync API
    const lambdaDs = api.addLambdaDataSource("lambdaDatasource", inboxFn);

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "listNotifications",
    });
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "addNotification",
    });

    const inboxTable = new ddb.Table(this, "InboxTable", {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "pk",
        type: ddb.AttributeType.STRING,
      },
      sortKey: {
        name: "sk",
        type: ddb.AttributeType.STRING,
      },
      timeToLiveAttribute: "expiresAt",
    });

    inboxTable.grantReadWriteData(inboxFn);
    inboxFn.addEnvironment("DDB_TABLE", inboxTable.tableName);
  }
}
