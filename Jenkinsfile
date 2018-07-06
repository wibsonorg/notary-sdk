pipeline {
  agent {
    dockerfile {
      filename 'Dockerfile'
    }
  }
  environment {
    npm_config_cache = 'npm-cache'
    workdir = '.'
    package_name = 'notary-api'
  }
  stages {
    stage('Setup') {
      steps {
        dir(workdir) {
          sh 'npm install'
        }
      }
    }
    stage('Status Checks') {
      parallel {
        stage('Test') {
          steps {
            dir(workdir) {
              sh 'npm run test:coverage'
            }
          }
        }
        stage('Linter') {
          steps {
            dir(workdir) {
              sh 'npm run lint'
            }
          }
        }
        stage('Audit') {
          steps {
            dir(workdir) {
              sh 'npm audit'
            }
          }
        }
      }
    }
    stage('Build') {
      steps {
        dir(workdir) {
          sh 'npm run build'
        }
      }
    }
    stage('Publish') {
      steps {
        dir(workdir) {
          sh '''mkdir artifacts build
cp -r dist build/
cp -r config build/
cp -r node_modules build/
cp package.json build/
cd build
tar -zcf ../artifacts/${package_name}.tar.gz .'''
          archiveArtifacts(artifacts: 'artifacts/*.tar.gz', fingerprint: true, onlyIfSuccessful: true)
        }
      }
    }
  }
  post {
    failure {
      slackSend(color: 'danger', message: "Attention: The pipeline ${currentBuild.fullDisplayName} has failed.")

    }

    success {
      slackSend(color: 'good', message: "The pipeline ${currentBuild.fullDisplayName} completed successfully.")

    }

    always {
      publishHTML(allowMissing: true, alwaysLinkToLastBuild: false, keepAll: true, reportDir: "${workdir}/coverage", reportFiles: 'index.html', reportTitles: 'Test Coverage Report', reportName: 'Test Coverage Report')

    }

  }
}
