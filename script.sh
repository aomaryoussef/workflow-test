IMAGE=$(docker image ls | grep "conductor-migrator")

if [[ ! -z "$IMAGE" ]]; then
    echo "Image exists"
else
    echo "not Exisgts"
fi