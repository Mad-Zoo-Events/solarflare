package client

import (
	"fmt"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"

	"github.com/eynorey/candyshop/src/model"
	"github.com/eynorey/candyshop/src/utils/cserror"
)

const (
	// ParticleEffectPresetsTable table where particle effects are stored
	ParticleEffectPresetsTable = "presets_particle-effects"
	// DragonEffectPresetsTable table where dragon effects are stored
	DragonEffectPresetsTable = "presets_dragon-effects"
	// TimeshiftEffectPresetsTable table where timeshift effects are stored
	TimeshiftEffectPresetsTable = "presets_timeshift-effects"
)

var (
	sess *session.Session
	db   *dynamodb.DynamoDB
)

func init() {
	sess = session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
		Config: aws.Config{
			Region: aws.String("us-east-2"),
		},
	}))

	db = dynamodb.New(sess)
}

// GetParticleEffectPresets retrieves all particle effect presets from the database
func GetParticleEffectPresets() (presets []model.ParticleEffectPreset) {
	tableName := ParticleEffectPresetsTable

	result, err := db.Scan(&dynamodb.ScanInput{
		TableName: &tableName,
	})
	if err != nil {
		cserror.New(cserror.DatabaseCRUD, "Failed to read particle effect presets", err)
		return nil
	}

	for _, item := range result.Items {
		preset := model.ParticleEffectPreset{}

		err = dynamodbattribute.UnmarshalMap(item, &preset)
		if err != nil {
			cserror.New(cserror.DatabaseUnmarshal, "Failed to unmarshal particle effect preset", err)
			continue
		}

		preset.TransformToUI()

		presets = append(presets, preset)
	}

	return
}

// GetDragonEffectPresets retrieves all dragon effect presets from the database
func GetDragonEffectPresets() (presets []model.DragonEffectPreset) {
	tableName := DragonEffectPresetsTable

	result, err := db.Scan(&dynamodb.ScanInput{
		TableName: &tableName,
	})
	if err != nil {
		cserror.New(cserror.DatabaseCRUD, "Failed to read dragon effect presets", err)
		return nil
	}

	for _, item := range result.Items {
		preset := model.DragonEffectPreset{}

		err = dynamodbattribute.UnmarshalMap(item, &preset)
		if err != nil {
			cserror.New(cserror.DatabaseUnmarshal, "Failed to unmarshal dragon effect preset", err)
			continue
		}

		presets = append(presets, preset)
	}

	return
}

// GetTimeshiftEffectPresets retrieves all timeshift effect presets from the database
func GetTimeshiftEffectPresets() (presets []model.TimeshiftEffectPreset) {
	tableName := TimeshiftEffectPresetsTable

	result, err := db.Scan(&dynamodb.ScanInput{
		TableName: &tableName,
	})
	if err != nil {
		cserror.New(cserror.DatabaseCRUD, "Failed to read timeshift effect presets", err)
		return nil
	}

	for _, item := range result.Items {
		preset := model.TimeshiftEffectPreset{}

		err = dynamodbattribute.UnmarshalMap(item, &preset)
		if err != nil {
			cserror.New(cserror.DatabaseUnmarshal, "Failed to unmarshal timeshift effect preset", err)
			continue
		}

		preset.TransformToUI()

		presets = append(presets, preset)
	}

	return
}

// UpsertEffectPreset adds an effect preset to the database
func UpsertEffectPreset(tableName string, preset interface{}) error {
	item, err := dynamodbattribute.MarshalMap(preset)
	if err != nil {
		return cserror.New(cserror.DatabaseMarshal, "Failed to marshal effect preset", err)
	}

	_, err = db.PutItem(&dynamodb.PutItemInput{
		Item:      item,
		TableName: aws.String(tableName),
	})
	if err != nil {
		return cserror.New(cserror.DatabaseCRUD, "Failed to upsert effect preset", err)
	}

	return nil
}

// DeleteEffectPreset deletes an effect preset from the database
func DeleteEffectPreset(tableName, id string) error {
	_, err := db.DeleteItem(&dynamodb.DeleteItemInput{
		Key: map[string]*dynamodb.AttributeValue{
			"id": {
				S: aws.String(id),
			},
		},
		TableName: aws.String(tableName),
	})

	if err != nil {
		if aerr, ok := err.(awserr.Error); ok {
			if aerr.Code() == dynamodb.ErrCodeResourceNotFoundException {
				return cserror.New(cserror.DatabaseNotFound, fmt.Sprintf("Effect preset with %s des not exist", id), err)
			}
		}
		return cserror.New(cserror.DatabaseCRUD, "Error deleting effect preset", err)
	}

	return nil
}
