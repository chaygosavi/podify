import { RequestHandler } from "express";
import { ObjectId, isValidObjectId } from "mongoose";
import Audio, { AudioDocument } from "#/models/audio";
import Favorite from "#/models/favourite";
import { PopulatedFavList } from "#/@types/audio";

export const toggleFavorite: RequestHandler = async (req, res) => {
  // audio is already in fav

  const audioId = req.query.audioId as string;

  let status: "added" | "removed";

  if (!isValidObjectId(audioId))
    return res.status(422).json({ error: "Audio id is invalid!" });
  const audio = await Audio.findById(audioId);
  if (!audio) return res.status(404).json({ error: "Recources not found!" });

  const alreadyExists = await Favorite.findOne({
    owner: req.user.id,
    items: audioId,
  });

  if (alreadyExists) {
    await Favorite.updateOne(
      { owner: req.user.id },
      {
        $pull: { items: audioId },
      }
    );
    status = "removed";
  } else {
    const favorite = await Favorite.findOne({ owner: req.user.id });
    await Favorite.updateOne(
      { owner: req.user.id },
      {
        $addToSet: { items: audioId },
      }
    );
    if (favorite) {
    } else {
      await Favorite.create({ owner: req.user.id, items: [audioId] });
    }
    status = "added";
  }

  if (status === "added") {
    await Audio.findByIdAndUpdate(audioId, {
      $addToSet: { likes: req.user.id },
    });
  }

  if (status === "removed") {
    await Audio.findByIdAndUpdate(audioId, {
      $pull: { likes: req.user.id },
    });
  }

  res.json({ status });
};

export const getFavorites: RequestHandler = async (req, res) => {
  const userID = req.user.id;
  const favorite = await Favorite.findOne({ owner: userID }).populate<{
    items: PopulatedFavList[];
  }>({
    path: "items",
    populate: {
      path: "owner",
    },
  });

  if (!favorite) return res.json({ audios: [] });

  const audios = favorite.items.map((item) => {
    return {
      id: item._id,
      title: item.title,
      category: item.category,
      file: item.file.url,
      poster: item.poster?.url,
      owner: {
        id: item.owner._id,
        name: item.owner.name,
      },
    };
  });

  return res.json({ audios });
};

export const getIsFavorite: RequestHandler = async (req, res) => {
  const audioId = req.query.audioId as string;

  if (!isValidObjectId(audioId))
    return res.status(422).json({ error: "Invalid audio id!" });

  const favorite = await Favorite.findOne({
    owner: req.user.id,
    items: audioId,
  });

  console.log("favorite", favorite);

  res.json({ result: favorite ? true : false });
};
