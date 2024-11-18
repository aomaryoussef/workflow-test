<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://myloapp.com/public/shared/img/mylo-logo.svg" width="200" alt="Nest Logo" /></a>
</p>

  <p align="center"><b>External</b> component that provides integration to 3rd parties outside of mylo organization</p>
  <p align="center">
    <img src="https://img.shields.io/badge/Language-Typescript-ff3f59.svg"/>
    <img src="https://img.shields.io/badge/Integration-Fawry-blue.svg"/>
    <img src="https://img.shields.io/badge/Integration-Paymob-green.svg"/>
  </p>


## Integrations

### Fawry

Fawry has only two endpoints, one to query the dues of a consumer, and the other is to pay these dues.

* Get upcoming payment
  * verify the signature to make sure that the sender is Fawry
  * verify that the phone number provided is a valid Egyptian phone number
  * query the system using Hasura to get the consumer upcoming payments (in mylo and minicash)
    * return proper response if no dues are available
  * aggregate and group the upcoming payments by date (day in month), then sort those starting from the oldest to the newest
  * return only the amount needed in the first upcoming date (day in the month)

* Book payment
  * if the payment registry (Formance) is not available for some reason, reject the payment from Fawry side as mylo is unable to receive payments at the moment
  * verify the signature to make sure that the sender is Fawry
  * query the payment registry, look for payments that targets the same loan schedules
    * if we find any, then this payment has been registered before, return proper response
  * if the payment registry has no account for this consumer, then create an account for him
  * query the system using Hasura to get the consumer upcoming payments (in mylo and minicash)
    * if the amount sent by Fawry is not the same as the total due amount, return a proper response
  * create the payment in formance
    * Fawry sends the timestamp in local time (Cairo), convert that into UTC
  * initiate a conductor workflow to process the payment
    * the ID of the workflow is sent back to Fawry to indicate a successful booking of the payment (regardless of the workflow success of failure)
  * update the payment registry metadata of this exact payment
    * add metadata to the payment (workflow ID - sender - target loan schedules - etc...)


## Services

### Hasura

A type safe sdk is generated for hasura server using [GraphQL-Codegen](https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-generic-sdk)

#### How to request data from hasura?

- create a new graphql named query in a gql file for example `core-services/hasura/graphql/list-all-loans.gql` with th following query

  ```gql
  query listAllLoans {
    loans {
      id
      created_at
    }
  }
  ```

- run `npm run codegen`
- a fully typed function with the same name will be generated for you `sdk.listAllLoans()`
