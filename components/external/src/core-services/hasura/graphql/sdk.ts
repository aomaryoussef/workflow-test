import { DocumentNode } from 'graphql';
import { getSdk, Sdk } from './_generated';

export function createSdk(url: string): Sdk {
  return getSdk(async function requester<R, V>(
    doc: DocumentNode,
    vars?: V,
  ): Promise<R> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: doc.loc?.source.body,
        variables: vars,
      }),
    });
    const { data, errors } = await response.json();

    if (errors) {
      // graphql return errors as value, so
      // throw the error to capture in the service
      throw new Error(errors.map((e: any) => e.message).join(', '));
    }
    return data;
  });
}
