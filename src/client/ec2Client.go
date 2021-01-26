package client

import (
	"fmt"

	"github.com/aws/aws-sdk-go/service/ec2"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

const (
	statePending = 0
	// stateShuttingDown = 32
	stateRunning = 16
	// stateTerminated = 48
	stateStopping      = 64
	stateStopped       = 80
	statusInitializing = "initializing"
)

var truthy = true

// StartInstance starts a specific instance
func StartInstance(instanceID string) error {
	if _, err := ec2Client.StartInstances(&ec2.StartInstancesInput{
		InstanceIds: []*string{&instanceID},
	}); err != nil {
		return sferror.New(sferror.InstanceManagementError, "Error starting instance "+instanceID, err)
	}

	return nil
}

// StopInstance stops a specific instance
func StopInstance(instanceID string) error {
	if _, err := ec2Client.StopInstances(&ec2.StopInstancesInput{
		InstanceIds: []*string{&instanceID},
	}); err != nil {
		return sferror.New(sferror.InstanceManagementError, "Error stopping instance "+instanceID, err)
	}

	return nil
}

// GetStatus gets the status of a specific instance
func GetStatus(instanceID string) (model.InstanceStatus, error) {
	output, err := ec2Client.DescribeInstanceStatus(&ec2.DescribeInstanceStatusInput{
		InstanceIds:         []*string{&instanceID},
		IncludeAllInstances: &truthy,
	})

	if err != nil ||
		len(output.InstanceStatuses) == 0 ||
		output.InstanceStatuses[0] == nil ||
		output.InstanceStatuses[0].InstanceState == nil ||
		output.InstanceStatuses[0].InstanceState.Code == nil {
		return model.InstanceStatusUnknown, sferror.New(sferror.InstanceManagementError, "Error checking status for instance "+instanceID, err)
	}

	switch *output.InstanceStatuses[0].InstanceState.Code {
	case statePending:
		return model.InstanceStatusPending, nil
	case stateRunning:
		if output.InstanceStatuses[0].InstanceStatus != nil &&
			output.InstanceStatuses[0].InstanceStatus.Status != nil &&
			*output.InstanceStatuses[0].InstanceStatus.Status == statusInitializing {

			return model.InstanceStatusInitializing, nil
		}
		return model.InstanceStatusRunning, nil
	case stateStopped:
		return model.InstanceStatusStopped, nil
	case stateStopping:
		return model.InstanceStatusStopping, nil
	default:
		return model.InstanceStatusUnknown, sferror.New(
			sferror.InstanceManagementError,
			fmt.Sprintf("Unknown status '%d' for instance %s", *output.InstanceStatuses[0].InstanceState.Code, instanceID),
			err,
		)
	}
}
