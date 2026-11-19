pipeline {
    agent any
    environment {
        // Replace with the Private IP of your Registry EC2 instance
        REGISTRY_URL = '172.31.46.23:5000'
        IMAGE_NAME = 'unsec-reg-ec2-node-app'
        
        // Replace with the Private IP of your Target EC2 instance
        TARGET_EC2_IP = '172.31.17.89' 
    }
    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }
        
        stage('Execute Tests') {
            agent {
                docker { image 'node:alpine'; args '-u root:root'; reuseNode true }
            }
            steps {
                sh 'npm ci'
                sh 'npm test' 
            }
        }
        
        stage('Build & Push to Private Registry') {
            steps {
                // 1. Build the image and tag it with the Private Registry URL
                sh "docker build -t ${REGISTRY_URL}/${IMAGE_NAME}:${env.BUILD_NUMBER} ."
                
                // 2. Push directly to the Registry EC2 instance (No login required for basic HTTP registry)
                sh "docker push ${REGISTRY_URL}/${IMAGE_NAME}:${env.BUILD_NUMBER}"
                
                // 3. Optional: Remove the local image from the Jenkins server to save disk space
                sh "docker rmi ${REGISTRY_URL}/${IMAGE_NAME}:${env.BUILD_NUMBER}"
            }
        }
        
        stage('Deploy to Target EC2') {
            steps {
                sshagent(['target-ec2-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@${TARGET_EC2_IP} '
                            docker stop node-app || true
                            docker rm node-app || true
                            
                            // Target server pulls the image from the Registry EC2 instance
                            docker pull ${REGISTRY_URL}/${IMAGE_NAME}:${env.BUILD_NUMBER}
                            
                            docker run -d -p 3000:3000 --name node-app ${REGISTRY_URL}/${IMAGE_NAME}:${env.BUILD_NUMBER}
                        '
                    """
                }
            }
        }
    }
}