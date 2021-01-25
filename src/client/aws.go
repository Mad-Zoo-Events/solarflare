package client

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/ec2"
)

var (
	sess      *session.Session
	dbClient  *dynamodb.DynamoDB
	ec2Client *ec2.EC2
)

func init() {
	sess = session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
		Config: aws.Config{
			Region: aws.String("us-east-2"),
		},
	}))

	dbClient = dynamodb.New(sess)
	ec2Client = ec2.New(sess)
}
