workspace "Loan Management System" "This shows the detailed view of how a loan amangement system is constructed" {

    model {
        properties {
            "structurizr.groupSeparator" "/"
        }

        consumer = person "Consumer" "An end-user of the consumer financer business" "Consumer"
        partnerAdmin = person "Partner Admin" "An end-user of the consumer financer business" "Partner Admin"

        group "mylo Consumer Finance" {

            processOrchestrator = softwaresystem "Process Orchestrator Platform" "Manages all the business processes across the organisation" "Existing System"
            datadog = softwaresystem "Datadog" "APM platform" "Existing System"

            internalTreasurer = person "Treasurer" "Treasurer" "Treasurer"
            internalAccountant = person "Accountant" "Accountant" "Accountant"

            group "Core Financials - Finance Domain" {

                generalAccounting = softwaresystem "General Accounting" "Manages all organisational accounting and reporting capabilities" "ERP"

                lms = softwaresystem "Loan Management System" "Allows to manage financial products, associated loans and their lifecycle processes" {
                    consumerMobileApp = container "Consumer Mobile App" "Native iOS or Android" "Mobile"
                    merchantAdminPortal = container "SSR Frontend Application" "Provides all administration capabilities and related data to partner merchant admins via their web browser." "Web Browser"
                    internalFrontend = container "Internal UI - LMS" "Provides all of the administartion function on LMS using AppSmith" "Web Browser"

                    apiBackend = container "API Backend" "Exposes capabilities via HTTPs APIs" "Golang 1.21 Native" {
                        financialProductController = component "Financial Product Controller" "Exposes READ APIs to visualise financial products" "Golang Chi controller"
                        journalController = component "Journal Controller" "Exposes READ APIs to query accounting journal entries" "Golang Chi controller"
                        originationController = component "Origination Controller" "Exposes READ APIs to query loan applications" "Golang Chi controller"
                        servicingController = component "Servicing Controller" "Exposes READ and State change command APIs to manage loan lifecycle" "Golang Chi controller"
                        gaReconciliationController = component "GA Reconciliation Controller" "Exposes READ APIs to visualise reconciliation states and process" "Golang Chi controller"
                    }
                    workerBackend = container "Worker Backend" "Scalable workers responding to tasks from process orchestrator" "Golang 1.21 Native" {
                        journalWorker = component "Journal Worker" "Workers" "Netflix Conductor Task Worker"
                        originationWorker = component "Origination Worker" "Workers" "Netflix Conductor Task Worker"
                        servicingWorker = component "Servicing Worker" "Workers" "Netflix Conductor Task Worker"
                        gaReconciliationWorker = component "GA Reconcialiation Worker" "Workers" "Netflix Conductor Task Worker"
                    }
                    database = container "Database" "Stores financial information, access logs, etc." "PostgreSQL" "Amazon Web Services - RDS"
                    filesystem = container "Filesystem" "Stores financial products and meta-model" "YAML"
                }
            }
        }

        # relationships between people and software systems to/from
        consumer -> lms "Views loans, available financial products, transactional details using"
        partnerAdmin -> lms "Views transactional orders and accounts payable statuses using"
        internalTreasurer -> lms "Views auditory information for detailed transactions using"
        internalAccountant -> lms "Views book-keeping records for all transactions using"
        lms -> generalAccounting "Sends EOD transactional aggregations and merchant accounts payable" "HTTPs"
        generalAccounting -> lms "Sends merchant payments confirmation" "HTTPs"
        generalAccounting -> lms "Sends bad debt provisions for loans" "HTTPs"
        lms -> datadog "Sends logs and metrics to" "DogStatsD"

        # relationships to/from containers
        internalTreasurer -> internalFrontend "Uses" "Web Browser"
        internalAccountant -> internalFrontend "Uses" "Web Browser"
        consumer -> consumerMobileApp "Uses" "Mobile"
        partnerAdmin -> merchantAdminPortal "Uses" "Web Browser"

        internalFrontend -> apiBackend "Views and updates financial products, loans and related transactional details using" "HTTPs"
        consumerMobileApp -> apiBackend "Views historic transactions, loan schedule and repayment details" "HTTPs"
        merchantAdminPortal -> apiBackend "Views historic transactions, payment details" "HTTPs"

        apiBackend -> processOrchestrator "Starts, Updates status of related process workflows" "HTTPs"
        processOrchestrator ->  workerBackend "Pushes new tasks of related business processes" "mTLS"

        apiBackend -> database "Reads business entities and states" "mTLS"
        workerBackend -> database "Writes state changes, business entities" "mTLS"

        # relationships to/from components
        consumerMobileApp -> servicingController "Reads consumer loans and details"
        consumerMobileApp -> originationController "Reads active / historic loan applications"

        merchantAdminPortal -> servicingController "Reads transactions and order view together with payment details"

        internalFrontend -> financialProductController "Reads financial product(s)" "HTTPs"
        internalFrontend -> journalController "Reads financial entries and double-entry accounts book-keeping" "HTTPs"
        internalFrontend -> originationController "Reads existing loan applications and statuses" "HTTPs"
        internalFrontend -> servicingController "Reads loan book and other related analysis" "HTTPs"
        internalFrontend -> gaReconciliationController "Reads analysis of GA reconciliations and statues" "HTTPs"

        processOrchestrator -> journalWorker "Pushes tasks related to book-keeping"
        processOrchestrator -> originationWorker "Pushes tasks related to loan application and origination"
        processOrchestrator -> servicingWorker "Pushes tasks related to servicing"
        processOrchestrator -> gaReconciliationWorker ""

        financialProductController -> filesystem "Reads financial products and meta-model information"
        journalController -> database "Reads journal entries"
        originationController -> database "Reads loan applications and statuses"
        servicingController -> database "Reads loan statuses and related financial entries"
        servicingController -> processOrchestrator "Initiates required back-office processes"
        gaReconciliationController -> database "Reads GA reconciliation aggregated data and status"
        gaReconciliationController -> processOrchestrator "Initiates required back-office update processes for requests from GA"
        generalAccounting -> gaReconciliationController "Publishes merchant payment statuses"

        journalWorker -> database "Appends journal entries"
        originationWorker -> database "Creates / Updates loan applications and statuses"
        servicingWorker -> database "Writes / Appends loan statuses and related financial entries"
        gaReconciliationWorker -> database "Writes GA reconciliation status"
        gaReconciliationWorker -> generalAccounting "Prepares and posts GA reconciliation aggregated data" "HTTPs"


        deploymentEnvironment "Local" {
            deploymentNode "Developer Laptop" "" "" {
                deploymentNode "lms-workers" "" "Linux Process" "" 1 {
                    localWorkerBackendInstance = containerInstance workerBackend
                }
                deploymentNode "lms-api" "" "Linux Process" "" 1 {
                    localApiBackendInstance = containerInstance apiBackend
                }
                deploymentNode "database" "" "Linux Process" "" 1 {
                    localDatabaseInstance = containerInstance database
                }
            }
        }

        deploymentEnvironment "Live" {
            deploymentNode "LMS Application Deployment" "" "Kubernetes" {
                deploymentNode "lms-workers" "" "Docker - Linux Alpine 3.19" "" 3 {
                    liveWorkerBackendInstance = containerInstance workerBackend
                }
                deploymentNode "lms-api" "" "Docker - Linux Alpine 3.19" "" 3 {
                    liveApiBackendInstance = containerInstance apiBackend
                }
            }

            deploymentNode "LMS Database Deployment" "" "AWS RDS" {
                primaryDatabaseServer = deploymentNode "PostgreSQL - Primary" "" "PostgreSQL 15" {
                    livePrimaryDatabaseInstance = containerInstance database
                }
                secondaryDatabaseServer = deploymentNode "PostgreSQL - Secondary" "" "PostgreSQL 15" {
                    liveSecondaryDatabaseInstance = containerInstance database
                }
            }

            primaryDatabaseServer -> secondaryDatabaseServer "Replicates data to"
        }
    }

    views {

        systemcontext lms "SystemContext" {
            include *
            animation {
                lms
                generalAccounting
                processOrchestrator
                consumer
                partnerAdmin
            }
//            autoLayout
            description "The system context diagram for the Loan Management System"
            properties {
                structurizr.groups true
            }
        }

        container lms "Containers" {
            include *
            animation {
                internalFrontend merchantAdminPortal consumerMobileApp
                apiBackend workerBackend
                database
                consumer partnerAdmin processOrchestrator datadog
            }
//            autolayout
            description "The container diagram for the Loan Management System"
        }

        component apiBackend "ComponentsAPIBackend" {
            include *
            animation {

                internalFrontend merchantAdminPortal consumerMobileApp
                financialProductController journalController originationController servicingController gaReconciliationController
            }
            autoLayout
            description "The component diagram for the API driven Loan Management System"
        }

        component workerBackend "ComponentsWorkers" {
            include *
            animation {
                journalWorker originationWorker servicingWorker gaReconciliationWorker

            }
            autoLayout
            description "The component diagram for the worker / task driven Loan Management System"
        }

        deployment lms "Local" "LocalDeployment" {
            include *
            animation {
                localWorkerBackendInstance localApiBackendInstance
                localDatabaseInstance
            }
            autoLayout
            description "Local deployment specification of the Loan Management System on developer machine"
        }

        deployment lms "Live" "LiveDeployment" {
            include *
            animation {
                liveWorkerBackendInstance liveApiBackendInstance
            }
            autoLayout
            description "Live deployment specification of the Loan Management System"
        }

        styles {
            element "Person" {
                color #ffffff
                fontSize 18
                shape Person
            }
            element "Consumer" {
                background #800000
            }
            element "Partner Admin" {
                background #800000
            }
            element "Treasurer" {
                background #1168bd
            }
            element "Accountant" {
                background #1168bd
            }
            element "Software System" {
                background #1168bd
                color #ffffff
            }
            element "Existing System" {
                background #999999
                color #ffffff
            }
            element "Container" {
                background #438dd5
                color #ffffff
            }
            element "Web Browser" {
                shape WebBrowser
            }
            element "Mobile App" {
                shape MobileDevicePortrait
            }
            element "Database" {
                shape Cylinder
            }
            element "Component" {
                background #85bbf0
                color #000000
            }
        }

        themes https://static.structurizr.com/themes/amazon-web-services-2023.01.31/theme.json https://static.structurizr.com/themes/kubernetes-v0.3/theme.json
    }
}