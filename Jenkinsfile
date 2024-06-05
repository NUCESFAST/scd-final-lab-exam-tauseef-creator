pipeline {
    agent any

    environment {
        AUTH_PORT = '3236'
        CLASSROOMS_PORT = '3237'
        CLIENT_PORT = '80'
        EVENT_BUS_PORT = '3238'
        POST_PORT = '3239'
    }

    stages {
        stage('21I-1236 - Checkout code') {
            steps {
                git 'https://github.com/NUCESFAST/scd-final-lab-exam-tauseef-creator.git'
            }
        }

        stage('21I-1236 - Build and Push Docker images') {
            steps {
                script {
                    def services = ['auth', 'classrooms', 'client', 'event-bus', 'post']
                    for (service in services) {
                        dir(service) {
                            // Install dependencies
                            sh 'npm install'

                            // Build Docker image
                            def dockerImage = docker.build("tauseefrazaq/${service}")

                            // Push Docker image
                            docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
                                dockerImage.push("latest")
                            }
                        }
                    }
                }
            }
        }

        stage('21I-1236 - Test application') {
            steps {
                script {
                    // Run and test each service
                    def services = ['auth', 'classrooms', 'client', 'event-bus', 'post']
                    def ports = [AUTH_PORT, CLASSROOMS_PORT, CLIENT_PORT, EVENT_BUS_PORT, POST_PORT]
                    for (int i = 0; i < services.size(); i++) {
                        sh "docker run --rm -d -p ${ports[i]}:${ports[i]} --name ${services[i]} tauseefrazaq/${services[i]}"
                        sh 'sleep 10' // Give the app some time to start
                        // Replace this with an actual test command for your application
                        sh "curl localhost:${ports[i]}"
                        sh "docker stop ${services[i]}"
                    }
                }
            }
        }
    }
}