import express, { Request, Response } from "express";
import cors from "cors";
import { db } from "./database/knex";
import { CONSTRAINT } from "sqlite3";
import { error } from "console";

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`);
});

app.get("/ping", async (req: Request, res: Response) => {
  try {
    res.status(200).send({ message: "Pong!" });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

// PRATICA 1

app.get("/bands", async (req: Request, res: Response) => {
  try {
    const result = await db.raw(`SELECT * FROM bands`);
    res.status(200).send(result);
  } catch (error: any) {
    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

// PRATICA 2
app.post("/bands", async (req: Request, res: Response) => {
  try {
    const { id, name } = req.body;

    if (!id || !name) {
      res.status(400);
      throw new Error("id ou name inválidos");
    }

    await db.raw(`INSERT INTO bands
        VALUES("${id}", "${name}")
        `);

    res.status(200).send("Banda cadastrada");
  } catch (error: any) {
    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

// PRATICA 3
app.put("/bands/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const newId = req.body.newId;
    const newName = req.body.newName;

    // console.log(id, newId, newName);

    if (newId !== undefined) {
      if (typeof newId !== "string") {
        res.status(400);
        throw new Error("Id deve ser uma string");
      }

      if (newId.length !== 4) {
        throw new Error("O id deve ter 4 caracteres");
      }
    }
    if (newName !== undefined) {
      if (typeof newName !== "string") {
        res.status(400);
        throw new Error("O name deve ser uma string");
      }

      if (newName.length < 2) {
        throw new Error("O name deve ter no mínimo 2 caracteres");
      }
    }

    const [band] = await db.raw(`SELECT * FROM bands WHERE id = "${id}"`);
    console.log(band)

    if(band){
        await db.raw(`
            UPDATE bands SET
            id = "${newId || band.id}",
            name = "${newName || band.name}"
            WHERE id = "${id}"
        `);
    } else {
        res.status(400)
        throw new Error("Id Não encontrado");
    }
    res.status(200).send("Banda atualizada");

  } catch (error: any) {
    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

// EXERCICIO DE FIXAÇAO
app.get("/songs", async (req:Request, res:Response) => {
  try {
    const result = await db.raw(`SELECT * FROM songs`);
    res.status(200).send(result)
  } catch (error:any) {
    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.post("/songs", async (req: Request, res: Response) => {
  try {
    const { id, name, band_id } = req.body;

    if (!id || !name || !band_id ) {
      res.status(400);
      throw new Error("id, name ou band_id inválidos");
    }

    await db.raw(`INSERT INTO songs
        VALUES("${id}", "${name}", "${band_id}")
        `);

    res.status(200).send("Musica cadastrada");
  } catch (error:any) {
    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.put("/songs/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const newId = req.body.newId;
    const newName = req.body.newName;
    const newBand_id = req.body.newBand_id;


    if (newId !== undefined) {
      if (typeof newId !== "string") {
        res.status(400);
        throw new Error("Id deve ser uma string");
      }

      if (newId.length !== 4) {
        throw new Error("O id deve ter 4 caracteres");
      }
    }
    if (newName !== undefined) {
      if (typeof newName !== "string") {
        res.status(400);
        throw new Error("O name deve ser uma string");
      }

      if (newName.length < 2) {
        throw new Error("O name deve ter no mínimo 2 caracteres");
      }
    }
    if (newBand_id !== undefined) {
      if (typeof newBand_id !== "string") {
        res.status(400);
        throw new Error("band_id deve ser uma string");
      }

      if (newBand_id.length !== 4) {
        throw new Error("O band_id deve ter 4 caracteres");
      }
    }

    const [song] = await db.raw(`SELECT * FROM songs WHERE id = "${id}"`);
    console.log(song)

    if(song){
        await db.raw(`
            UPDATE songs SET
            id = "${newId || song.id}",
            name = "${newName || song.name}",
            band_id = "${newBand_id || song.band_id}"
            WHERE id = "${id}"
        `);
    } else {
        res.status(400)
        throw new Error("Id Não encontrado");
    }
    res.status(200).send("Banda atualizada");

  } catch (error: any) {
    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});