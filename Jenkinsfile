/*
 * Copyright (c) 2023 big xyt AG
 * All rights reserved.
 */

pipeline {
  agent any

  parameters {
    string (name: 'uiVersion', defaultValue: 'abo-test-app-1.0.0', description: 'Version to be built')
    choice (name: 'repository', choices: 'none\ndev\nreleases', description: 'Nexus repository for artifacts upload')
    choice (name: 'buildVersion', choices: 'build-dev\nbuild-staging\nbuild-prod', description: 'Build version')
    booleanParam (name: 'buildImage', defaultValue: false, description: 'Build new docker image')
  }
  options { overrideIndexTriggers(false) }

  stages {

    stage ('build') {
      steps {
        echo "Building: ${params.uiVersion} ..."
        script {
          currentBuild.displayName = "#${currentBuild.number} : ${params.uiVersion} "
        }
        dir('.') {
          withEnv(['HOME=.']) {
            nodejs(nodeJSInstallationName: 'node-14.x', configId: 'npmrc') {
              sh "npm install"
              sh "npm install -g @angular/cli"
              sh "pwd"
              sh "hostname"

              sh "npm run ${params.buildVersion}"

              sh "node ./replace.build.js ${params.buildVersion} ${params.uiVersion}"

              sh "cd dist && zip -r ${params.uiVersion}.zip *"
            }
          }
        }
      }
    }

    stage ('docker') {
      steps {
        script {
          if (params.buildImage) {
            uiVersion = params.uiVersion ? params.uiVersion : 'snapshot'
            if (params.repository == 'dev') {
              docker.withRegistry('https://docker.snapshots.big-xyt.com', 'tu_deploy') {
                dir('.') {
                  def img = docker.build('abo-test-app')
                  // Git commit hash is not available by default, hence the workaround
                  sh 'git rev-parse HEAD > commit'
                  img.push(uiVersion)
                  // clean up
                  sh "docker rmi ${img.id}"
                }
              }
            } else if (params.repository == 'releases') {
              docker.withRegistry('https://docker.big-xyt.com', 'tu_deploy') {
                dir('.') {
                  def img = docker.build('abo-test-app')
                  // Git commit hash is not available by default, hence the workaround
                  sh 'git rev-parse HEAD > commit'
                  img.push(uiVersion)
                  // clean up
                  sh "docker rmi ${img.id}"
                }
              }
            }
          }
        }
      }
    }

  }

  post {
    always {
      echo 'Cleaning up...'
      //deleteDir()
    }
  }

}
