-- CreateTable
CREATE TABLE "articles" (
    "id" SERIAL NOT NULL,
    "language" VARCHAR(255),
    "text" VARCHAR(255),
    "title" VARCHAR(255),
    "destination_id" INTEGER,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "money" VARCHAR(255),
    "id" INTEGER NOT NULL,
    "capital_id" INTEGER,
    "flag_id" VARCHAR(255),

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destinations" (
    "id" SERIAL NOT NULL,
    "name_transliterated" VARCHAR(255),

    CONSTRAINT "destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" VARCHAR(255) NOT NULL,
    "data" BYTEA,
    "name" VARCHAR(255),
    "type" VARCHAR(255),
    "destination_id" INTEGER,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "towns" (
    "id" INTEGER NOT NULL,
    "country_id" INTEGER,

    CONSTRAINT "towns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "countries_flag_id_key" ON "countries"("flag_id");

-- CreateIndex
CREATE UNIQUE INDEX "countries_capital_id_key" ON "countries"("capital_id");

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "fktqd5as3kfoyea4af24se8hwgh" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "countries" ADD CONSTRAINT "fkalwmtnr7ged1vxt3uf9xw16d0" FOREIGN KEY ("id") REFERENCES "destinations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "countries" ADD CONSTRAINT "fkphg9244nt0y2qmepv8ictrk0a" FOREIGN KEY ("flag_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "countries" ADD CONSTRAINT "fknj59eij3rjtrrt4flxsca26fn" FOREIGN KEY ("capital_id") REFERENCES "towns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "fke6w8biky021uooedljek472ah" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "towns" ADD CONSTRAINT "fkpixcrhbw3rwrw0yp2yl4dbr74" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "towns" ADD CONSTRAINT "fk3lu61rjg0sjnpfccv5eps95fb" FOREIGN KEY ("id") REFERENCES "destinations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
