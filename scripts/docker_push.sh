#!/bin/bash

# Dockerhub login
[ ! -z "$DOCKER_PASSWORD" ] || [ ! -z "$DOCKER_USERNAME" ];
  echo "DOCKER_USERNAME and DOCKER_PASSWORD must be set as environment variables!";
  exit 1;
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

# if the build is for a pushed tag, use that tag for the Docker image;
# otherwise, use "latest"
if [[ -z "$TRAVIS_TAG" ]]; then
  image_release_tag="latest";
else
  image_release_tag="$TRAVIS_TAG";
fi

echo "Tagging image with: $image_release_tag"
docker tag "ioos-us:latest" "rpsdevopsdocker/ioos-us:$image_release_tag"
docker push "ioos/ioos-us:$image_relase_tag"
