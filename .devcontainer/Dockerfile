FROM codercom/enterprise-base

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

RUN add-apt-repository ppa:ondrej/php -y && \
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

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install --global yarn pnpm

RUN /bin/bash -c "$(curl -fsSL dub.sh/plugkit/linux)"

ADD on-create.sh /on-create.sh
RUN chmod +x /on-create.sh

USER coder
