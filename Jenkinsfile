node {
    checkout scm
    
    docker.withRegistry('https://registry.demooke.com', 'agung-registry') {

        def customImage = docker.build("saas-backend:v2")

        /* Push the container to the custom Registry */
        customImage.push()
    }
}