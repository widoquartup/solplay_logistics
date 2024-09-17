# Use the official MongoDB image as a base
FROM mongodb/mongodb-community-server:7.0.5-ubi9

# Set environment variables
ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin \
    container=oci \
    HOME=/data/db

# Create necessary directories (if they don't already exist)
RUN mkdir -p /data/configdb /data/db

# Copy custom MongoDB configuration file into the image
COPY mongod.conf /etc/mongod.conf

# Expose MongoDB port
EXPOSE 27017

# Set the default command to run MongoDB with the custom configuration
CMD ["mongod", "--config", "/etc/mongod.conf"]
