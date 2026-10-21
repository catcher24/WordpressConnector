# Pinned so base image upgrades (e.g. the move to Ubuntu 26.04) happen deliberately, not on rebuild.
FROM codercom/enterprise-base:ubuntu-noble

USER root

RUN apt-get update && \
    apt-get install -y \
    curl \
    wget \
    nmap \
    fuse-overlayfs \
    build-essential \
    git \
    sudo \
    software-properties-common

# ppa:ondrej/php is being merged into packages.sury.org/php, which supports all current Ubuntu releases.
RUN curl -fsSLo /tmp/debsuryorg-archive-keyring.deb https://packages.sury.org/debsuryorg-archive-keyring.deb && \
    dpkg -i /tmp/debsuryorg-archive-keyring.deb && \
    rm /tmp/debsuryorg-archive-keyring.deb && \
    . /etc/os-release && \
    echo "deb [signed-by=/usr/share/keyrings/debsuryorg-archive-keyring.gpg] https://packages.sury.org/php/ ${VERSION_CODENAME} main" > /etc/apt/sources.list.d/php.list && \
    apt-get update && \
    apt-get install -y \
    php8.2-cli \
    php8.2-curl \
    php8.2-mysql \
    php8.2-mbstring \
    php8.2-xml \
    php8.2-zip \
    php8.2-gd \
    php8.2-intl \
    unzip

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar && \
    chmod +x wp-cli.phar && \
    mv wp-cli.phar /usr/local/bin/wp

RUN curl -fsSL https://get.docker.com | sh

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    corepack enable pnpm yarn

RUN /bin/bash -c "$(curl -fsSL dub.sh/plugkit/linux)"

ADD on-create.sh /on-create.sh
RUN chmod +x /on-create.sh

USER coder
