import { StartWorkflowRequest, orkesConductorClient } from "@io-orkes/conductor-javascript";
import { config } from "../../config";

const workflowConfig = {
  serverUrl: `${config.workflowBaseURL}/api`,
};
const clientPromise = orkesConductorClient(workflowConfig);

// Start a workflow
export async function startWorkflow(startWorkflowRequest: StartWorkflowRequest): Promise<string> {
  try {
    const client = await clientPromise;
    const response = await client.workflowResource.startWorkflow(startWorkflowRequest);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}
