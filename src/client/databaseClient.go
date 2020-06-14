package client

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"

	"github.com/eynorey/candyshop/src/model"
	"github.com/eynorey/candyshop/src/utils/cserror"
)

const (
	particleEffectPresetsTable = "particleEffects"
	dragonEffectPresetsTable   = "dragonEffects"
)

var (
	sess *session.Session
	db   *dynamodb.DynamoDB
)

func init() {
	sess = session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))

	db = dynamodb.New(sess)
}

// GetParticleEffectPresets retrieves all particle effect presets from the database
func GetParticleEffectPresets() (presets []model.ParticleEffectPreset) {
	tableName := particleEffectPresetsTable

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

		presets = append(presets, preset)
	}

	return
}

// GetDragonEffectPresets retrieves all dragon effect presets from the database
func GetDragonEffectPresets() (presets []model.DragonEffectPreset) {
	tableName := dragonEffectPresetsTable

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

// InsertParticleEffectPreset adds a particle effect preset to the database
func InsertParticleEffectPreset(preset model.ParticleEffectPreset) error {
	tableName := particleEffectPresetsTable

	item, err := dynamodbattribute.MarshalMap(preset)
	if err != nil {
		return cserror.New(cserror.DatabaseMarshal, "Failed to marshal particle effect preset", err)
	}

	_, err = db.PutItem(&dynamodb.PutItemInput{
		Item:      item,
		TableName: aws.String(tableName),
	})
	if err != nil {
		return cserror.New(cserror.DatabaseCRUD, "Failed to insert particle effect preset", err)
	}

	return nil
}

// InsertDragonEffectPreset adds a dragon effect preset to the database
func InsertDragonEffectPreset(preset model.DragonEffectPreset) error {
	tableName := dragonEffectPresetsTable

	item, err := dynamodbattribute.MarshalMap(preset)
	if err != nil {
		return cserror.New(cserror.DatabaseMarshal, "Failed to marshal dragon effect preset", err)
	}

	_, err = db.PutItem(&dynamodb.PutItemInput{
		Item:      item,
		TableName: aws.String(tableName),
	})
	if err != nil {
		return cserror.New(cserror.DatabaseCRUD, "Failed to insert dragon effect preset", err)
	}

	return nil
}
