#!/bin/bash

# Function to display the current version
show_version() {
    docker exec n8n n8n --version
}

# Function to create backup
create_backup() {
    timestamp=$(date +%Y%m%d_%H%M%S)
    backup_dir="./backups/n8n_backup_$timestamp"
    mkdir -p "$backup_dir"
    docker run --rm --volumes-from n8n -v $(pwd)/${backup_dir}:/backup ubuntu tar cvf /backup/n8n_data.tar /home/node/.n8n
    echo "Backup created at $backup_dir"
}

# Function to update n8n
update_n8n() {
    echo "Creating backup before update..."
    create_backup
    
    echo "Pulling latest n8n image..."
    docker-compose pull n8n
    
    echo "Restarting n8n with new image..."
    docker-compose down && docker-compose up -d
    
    echo "Waiting for n8n to start..."
    sleep 10
    
    echo "New version:"
    show_version
}

case "$1" in
    "version")
        show_version
        ;;
    "backup")
        create_backup
        ;;
    "update")
        update_n8n
        ;;
    *)
        echo "Usage: $0 {version|backup|update}"
        exit 1
        ;;
esac
