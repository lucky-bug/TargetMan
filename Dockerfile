FROM node:14.15

# Declare gid
ARG gid=1000

# Declare uid
ARG uid=1000

# Create group
RUN getent group ${gid} || groupadd -g ${gid} app || false

# Create user
RUN getent passwd ${uid} || useradd -m -u ${uid} -g ${gid} -s /bin/bash app || false

# Copy project
COPY --chown=${uid}:${gid} . /home/app/src

# Set working directory
WORKDIR /home/app/src

# Set user
USER ${uid}:${gid}

# Expose ports
EXPOSE 3000
