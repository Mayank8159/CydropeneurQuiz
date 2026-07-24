import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export function marshal(data: Record<string, unknown>) {
  return marshall(data, { removeUndefinedValues: true, convertClassInstanceToMap: true });
}

export function unmarshal(data: Record<string, any>) {
  return unmarshall(data);
}
