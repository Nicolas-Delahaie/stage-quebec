# Image de base
FROM php:7.4-fpm

# Installer les dépendances
RUN apt-get update && apt-get install -y \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    git

# Installer les extensions PHP nécessaires
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Installer Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Installer Node.js et NPM
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

# Configuration de l'utilisateur www-data
RUN chown -R www-data:www-data /var/www
USER www-data

# Répertoire de travail
WORKDIR /var/www

# Copier les fichiers du projet dans le conteneur
COPY . .

# Installer les dépendances PHP avec Composer
RUN composer install --no-dev

# Installer les dépendances JavaScript avec NPM
RUN npm install && npm run dev

# Exposer le port 9000 pour l'application PHP
EXPOSE 9000

# Démarrer PHP-FPM
CMD ["php-fpm"]
