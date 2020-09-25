package client

import (
	"fmt"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"

	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

const (
	// ParticleEffectPresetsTable table where particle effects are stored
	ParticleEffectPresetsTable = "presets_%s_particle-effects"
	// DragonEffectPresetsTable table where dragon effects are stored
	DragonEffectPresetsTable = "presets_%s_dragon-effects"
	// TimeshiftEffectPresetsTable table where timeshift effects are stored
	TimeshiftEffectPresetsTable = "presets_%s_timeshift-effects"
	// PotionEffectPresetsTable table where potion effects are stored
	PotionEffectPresetsTable = "presets_%s_potion-effects"
	// LaserEffectPresetsTable table where laser effects are stored
	LaserEffectPresetsTable = "presets_%s_laser-effects"

	// ServerTable table where server addresses to be called are stored
	ServerTable = "servers"

	// CurrentEvent is the name of the event to load tables for (hardcoded for now)
	CurrentEvent = "mzitv"
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
	tableName := fmt.Sprintf(ParticleEffectPresetsTable, CurrentEvent)

	result, err := db.Scan(&dynamodb.ScanInput{
		TableName: &tableName,
	})
	if err != nil {
		sferror.New(sferror.DatabaseCRUD, "Failed to read particle effect presets", err)
		return nil
	}

	for _, item := range result.Items {
		preset := model.ParticleEffectPreset{}

		err = dynamodbattribute.UnmarshalMap(item, &preset)
		if err != nil {
			sferror.New(sferror.DatabaseUnmarshal, "Failed to unmarshal particle effect preset", err)
			continue
		}

		preset.TransformToUI()
		presets = append(presets, preset)
	}

	return
}

// GetDragonEffectPresets retrieves all dragon effect presets from the database
func GetDragonEffectPresets() (presets []model.DragonEffectPreset) {
	tableName := fmt.Sprintf(DragonEffectPresetsTable, CurrentEvent)

	result, err := db.Scan(&dynamodb.ScanInput{
		TableName: &tableName,
	})
	if err != nil {
		sferror.New(sferror.DatabaseCRUD, "Failed to read dragon effect presets", err)
		return nil
	}

	for _, item := range result.Items {
		preset := model.DragonEffectPreset{}

		err = dynamodbattribute.UnmarshalMap(item, &preset)
		if err != nil {
			sferror.New(sferror.DatabaseUnmarshal, "Failed to unmarshal dragon effect preset", err)
			continue
		}

		preset.TransformToUI()
		presets = append(presets, preset)
	}

	return
}

// GetTimeshiftEffectPresets retrieves all timeshift effect presets from the database
func GetTimeshiftEffectPresets() (presets []model.TimeshiftEffectPreset) {
	tableName := fmt.Sprintf(TimeshiftEffectPresetsTable, CurrentEvent)

	result, err := db.Scan(&dynamodb.ScanInput{
		TableName: &tableName,
	})
	if err != nil {
		sferror.New(sferror.DatabaseCRUD, "Failed to read timeshift effect presets", err)
		return nil
	}

	for _, item := range result.Items {
		preset := model.TimeshiftEffectPreset{}

		err = dynamodbattribute.UnmarshalMap(item, &preset)
		if err != nil {
			sferror.New(sferror.DatabaseUnmarshal, "Failed to unmarshal timeshift effect preset", err)
			continue
		}

		preset.TransformToUI()
		presets = append(presets, preset)
	}

	return
}

// GetPotionEffectPresets retrieves all potion effect presets from the database
func GetPotionEffectPresets() (presets []model.PotionEffectPreset) {
	tableName := fmt.Sprintf(PotionEffectPresetsTable, CurrentEvent)

	result, err := db.Scan(&dynamodb.ScanInput{
		TableName: &tableName,
	})
	if err != nil {
		sferror.New(sferror.DatabaseCRUD, "Failed to read potion effect presets", err)
		return nil
	}

	for _, item := range result.Items {
		preset := model.PotionEffectPreset{}

		err = dynamodbattribute.UnmarshalMap(item, &preset)
		if err != nil {
			sferror.New(sferror.DatabaseUnmarshal, "Failed to unmarshal potion effect preset", err)
			continue
		}

		preset.TransformToUI()
		presets = append(presets, preset)
	}

	return
}

// GetLaserEffectPresets retrieves all laser effect presets from the database
func GetLaserEffectPresets() (presets []model.LaserEffectPreset) {
	tableName := fmt.Sprintf(LaserEffectPresetsTable, CurrentEvent)

	result, err := db.Scan(&dynamodb.ScanInput{
		TableName: &tableName,
	})
	if err != nil {
		sferror.New(sferror.DatabaseCRUD, "Failed to read laser effect presets", err)
		return
	}

	for _, item := range result.Items {
		preset := model.LaserEffectPreset{}

		err = dynamodbattribute.UnmarshalMap(item, &preset)
		if err != nil {
			sferror.New(sferror.DatabaseUnmarshal, "Failed to unmarshal laser effect preset", err)
			continue
		}

		preset.TransformToUI()
		presets = append(presets, preset)
	}

	return
}

// GetServers retrieves all server addresses from the database
func GetServers() (servers []model.Server) {
	tableName := ServerTable

	result, err := db.Scan(&dynamodb.ScanInput{
		TableName: &tableName,
	})
	if err != nil {
		sferror.New(sferror.DatabaseCRUD, "Failed to read server addresses", err)
		return
	}

	for _, item := range result.Items {
		server := model.Server{}

		err = dynamodbattribute.UnmarshalMap(item, &server)
		if err != nil {
			sferror.New(sferror.DatabaseUnmarshal, "Failed to unmarshal server address", err)
			continue
		}

		servers = append(servers, server)
	}

	return
}

// UpsertItem updates or inserts an item on the database
func UpsertItem(tableName string, payload interface{}) error {
	item, err := dynamodbattribute.MarshalMap(payload)
	if err != nil {
		return sferror.New(sferror.DatabaseMarshal, "Failed to marshal item", err)
	}

	_, err = db.PutItem(&dynamodb.PutItemInput{
		Item:      item,
		TableName: aws.String(tableName),
	})
	if err != nil {
		return sferror.New(sferror.DatabaseCRUD, "Failed to upsert item", err)
	}

	return nil
}

// DeleteItem deletes an item from the database
func DeleteItem(tableName, id string) error {
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
				return sferror.New(sferror.DatabaseNotFound, fmt.Sprintf("Item with %s des not exist", id), err)
			}
		}
		return sferror.New(sferror.DatabaseCRUD, "Error deleting item", err)
	}

	return nil
}
