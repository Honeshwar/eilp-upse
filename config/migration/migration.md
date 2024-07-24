# make sure typeorm is globally install

npm install -g typeorm

# run on CLI

typeorm migration:create ./config/migration/newfile-name //empty migration create
or
typeorm migration:generate ./config/migration/a -d ./config/data-source.js//changes in entities

see file at path: ./config/migration/newfile-name

# run migration

typeorm migration:run -- -d path-to-datasource-config
