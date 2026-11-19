pipeline {
    agent any
    environment {
        REGISTRY_IP = '172.31.46.23'
        REGISTRY_PORT = '5000'
        IMAGE_NAME = 'unsec-reg-ec2-node-app'
        TARGET_EC2_IP = '172.31.17.89' // Use Target EC2 Private IP
    }
    stages {
        stage('Checkout Code') {
            steps { checkout scm }
        }

        stage('Execute Tests') {
            agent { docker { image 'node:alpine'; args '-u root:root'; reuseNode true } }
            steps {
                sh 'npm ci'
                sh 'npm test'
            }
        }

        stage('Build & Push to Private Registry') {
            steps {
                sh "docker build -t ${REGISTRY_IP}:${REGISTRY_PORT}/${IMAGE_NAME}:${env.BUILD_NUMBER} ."
                sh "docker push ${REGISTRY_IP}:${REGISTRY_PORT}/${IMAGE_NAME}:${env.BUILD_NUMBER}"
                sh "docker rmi ${REGISTRY_IP}:${REGISTRY_PORT}/${IMAGE_NAME}:${env.BUILD_NUMBER} || true"
            }
        }

        stage('Deploy to Target EC2') {
            steps {
                sshagent(['target-ec2-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@${TARGET_EC2_IP} '
                            docker stop node-app || true
                            docker rm node-app || true
                            docker pull ${REGISTRY_IP}:${REGISTRY_PORT}/${IMAGE_NAME}:${env.BUILD_NUMBER}
                            docker run -d -p 3000:3000 --name node-app ${REGISTRY_IP}:${REGISTRY_PORT}/${IMAGE_NAME}:${env.BUILD_NUMBER}
                        '
                    """
                }
            }
        }
    }
}