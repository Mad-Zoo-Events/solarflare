package client

import (
	"fmt"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"

	"github.com/eynorey/solarflare/src/config"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

const (
	// EffectPresetsTable template for effect tables
	EffectPresetsTable = "presets_%s_%s-effects"

	// ServerTable table where server addresses to be called are stored
	ServerTable = "servers"
	// SettingsTable table where settings are stored
	SettingsTable = "settings"
)

func scanTable(tableName string) *dynamodb.ScanOutput {
	if strings.Contains(tableName, "%s") {
		cfg := config.Get()
		tableName = fmt.Sprintf(tableName, cfg.SelectedStage)
	}

	result, err := dbClient.Scan(&dynamodb.ScanInput{
		TableName: &tableName,
	})
	if err != nil {
		sferror.New(sferror.DatabaseCRUD, "Failed to read presets", err)
		return nil
	}

	return result
}

// GetCommandEffectPresets retrieves all command effect presets from the database
func GetCommandEffectPresets() (presets []model.CommandEffectPreset) {
	if result := scanTable(fmt.Sprintf(EffectPresetsTable, "%s", model.CommandEffectType)); result != nil {
		for _, item := range result.Items {
			preset := model.CommandEffectPreset{}

			if err := dynamodbattribute.UnmarshalMap(item, &preset); err != nil {
				sferror.New(sferror.DatabaseUnmarshal, "Failed to unmarshal command effect preset", err)
				continue
			}

			presets = append(presets, preset)
		}
	}
	return
}

// GetDragonEffectPresets retrieves all dragon effect presets from the database
func GetDragonEffectPresets() (presets []model.DragonEffectPreset) {
	if result := scanTable(fmt.Sprintf(EffectPresetsTable, "%s", model.DragonEffectType)); result != nil {
		for _, item := range result.Items {
			preset := model.DragonEffectPreset{}

			if err := dynamodbattribute.UnmarshalMap(item, &preset); err != nil {
				sferror.New(sferror.DatabaseUnmarshal, "Failed to unmarshal dragon effect preset", err)
				continue
			}

			presets = append(presets, preset)
		}
	}
	return
}

// GetLaserEffectPresets retrieves all laser effect presets from the database
func GetLaserEffectPresets() (presets []model.LaserEffectPreset) {
	if result := scanTable(fmt.Sprintf(EffectPresetsTable, "%s", model.LaserEffectType)); result != nil {
		for _, item := range result.Items {
			preset := model.LaserEffectPreset{}

			if err := dynamodbattribute.UnmarshalMap(item, &preset); err != nil {
				sferror.New(sferror.DatabaseUnmarshal, "Failed to unmarshal laser effect preset", err)
				continue
			}

			presets = append(presets, preset)
		}
	}
	return
}

// GetLightningEffectPresets retrieves all lightning effect presets from the database
func GetLightningEffectPresets() (presets []model.LightningEffectPreset) {
	if result := scanTable(fmt.Sprintf(EffectPresetsTable, "%s", model.LightningEffectType)); result != nil {
		for _, item := range result.Items {
			preset := model.LightningEffectPreset{}

			if err := dynamodbattribute.UnmarshalMap(item, &preset); err != nil {
				sferror.New(sferror.DatabaseUnmarshal, "Failed to unmarshal lightning effect preset", err)
				continue
			}

			presets = append(presets, preset)
		}
	}
	return
}

// GetParticleEffectPresets retrieves all particle effect presets from the database
func GetParticleEffectPresets() (presets []model.ParticleEffectPreset) {
	if result := scanTable(fmt.Sprintf(EffectPresetsTable, "%s", model.ParticleEffectType)); result != nil {
		for _, item := range result.Items {
			preset := model.ParticleEffectPreset{}

			if err := dynamodbattribute.UnmarshalMap(item, &preset); err != nil {
				sferror.New(sferror.DatabaseUnmarshal, "Failed to unmarshal particle effect preset", err)
				continue
			}

			presets = append(presets, preset)
		}
	}
	return
}

// GetPotionEffectPresets retrieves all potion effect presets from the database
func GetPotionEffectPresets() (presets []model.PotionEffectPreset) {
	if result := scanTable(fmt.Sprintf(EffectPresetsTable, "%s", model.PotionEffectType)); result != nil {
		for _, item := range result.Items {
			preset := model.PotionEffectPreset{}

			if err := dynamodbattribute.UnmarshalMap(item, &preset); err != nil {
				sferror.New(sferror.DatabaseUnmarshal, "Failed to unmarshal potion effect preset", err)
				continue
			}

			presets = append(presets, preset)
		}
	}
	return
}

// GetTimeshiftEffectPresets retrieves all timeshift effect presets from the database
func GetTimeshiftEffectPresets() (presets []model.TimeshiftEffectPreset) {
	if result := scanTable(fmt.Sprintf(EffectPresetsTable, "%s", model.TimeshiftEffectType)); result != nil {
		for _, item := range result.Items {
			preset := model.TimeshiftEffectPreset{}

			if err := dynamodbattribute.UnmarshalMap(item, &preset); err != nil {
				sferror.New(sferror.DatabaseUnmarshal, "Failed to unmarshal timeshift effect preset", err)
				continue
			}

			presets = append(presets, preset)
		}
	}
	return
}

// GetServers retrieves all server addresses from the database
func GetServers(getStatus bool) (servers []model.Server) {
	if result := scanTable(ServerTable); result != nil {
		for _, item := range result.Items {
			server := model.Server{}

			if err := dynamodbattribute.UnmarshalMap(item, &server); err != nil {
				sferror.New(sferror.DatabaseUnmarshal, "Failed to unmarshal server address", err)
				continue
			}

			if getStatus {
				server.InstanceStatus, _ = GetStatus(server.ID)
			}

			servers = append(servers, server)
		}
	}
	return
}

// GetSetting retrieves all server addresses from the database
func GetSetting(key string) (*model.Setting, error) {
	tableName := SettingsTable

	result, err := dbClient.GetItem(&dynamodb.GetItemInput{
		TableName: &tableName,
		Key: map[string]*dynamodb.AttributeValue{
			"key": {
				S: aws.String(key),
			},
		},
	})
	if err != nil {
		return nil, sferror.New(sferror.DatabaseCRUD, "Failed to read setting", err)
	}

	if result.Item == nil {
		return nil, sferror.New(sferror.DatabaseNotFound, fmt.Sprintf("Setting %s could not be found", key), nil)
	}

	setting := &model.Setting{}

	err = dynamodbattribute.UnmarshalMap(result.Item, setting)
	if err != nil {
		return nil, sferror.New(sferror.DatabaseUnmarshal, "Failed to unmarshal setting", err)
	}

	return setting, nil
}

// UpsertItem updates or inserts an item on the database
func UpsertItem(tableName string, payload interface{}) error {
	if strings.Contains(tableName, "%s") {
		cfg := config.Get()
		tableName = fmt.Sprintf(tableName, cfg.SelectedStage)
	}

	item, err := dynamodbattribute.MarshalMap(payload)
	if err != nil {
		return sferror.New(sferror.DatabaseMarshal, "Failed to marshal item", err)
	}

	_, err = dbClient.PutItem(&dynamodb.PutItemInput{
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
	if strings.Contains(tableName, "%s") {
		cfg := config.Get()
		tableName = fmt.Sprintf(tableName, cfg.SelectedStage)
	}

	_, err := dbClient.DeleteItem(&dynamodb.DeleteItemInput{
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

// ReloadAllPresets reloads all presets from the database
func ReloadAllPresets() {
	cfg := config.Get()

	cfg.CommandEffectPresets = GetCommandEffectPresets()
	cfg.DragonEffectPresets = GetDragonEffectPresets()
	cfg.LaserEffectPresets = GetLaserEffectPresets()
	cfg.LightningEffectPresets = GetLightningEffectPresets()
	cfg.ParticleEffectPresets = GetParticleEffectPresets()
	cfg.PotionEffectPresets = GetPotionEffectPresets()
	cfg.TimeshiftEffectPresets = GetTimeshiftEffectPresets()
}
