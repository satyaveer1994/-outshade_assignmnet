const EventModel = require("../Model/eventModel");

const createEvent = async (req, res) => {
  try {
    if (!isValidRequestBody(req.body))
      return res.status(400).send({
        status: false,
        msg: "invalid request,please provide event details",
      });

    const { creator, title, description, eventDate } = req.body;
    const { invitee, time } = req.body.invitees[0];

    if (!isValid(creator) && !isValidObjectId(creator))
      return res
        .status(400)
        .send({ status: false, msg: " provide creator id" });

    if (!isValid(title))
      return res
        .status(400)
        .send({ status: false, msg: "provide title" });

    if (!isValid(description))
      return res
        .status(400)
        .send({ status: false, msg: "provide description" });

    if (!isValid(eventDate))
      return res
        .status(400)
        .send({ status: false, msg: " provide event date" });

    if (!isValidObjectId(invitee) && !isValid(invitee))
      return res
        .status(400)
        .send({ status: false, msg: "provide valid invite id" });

    if (!isValid(time))
      return res
        .status(400)
        .send({ status: false, msg: "provide time" });

    let newEvent = await EventModel.create(req.body);
    return res
      .status(201)
      .send({ status: true, msg: "event create successfully", data: newEvent });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

//////////////////////////////////////////////////////////////////

const invite = async (req, res) => {
  try {
    let eventId = req.params.id;
    let eventFinder = await EventModel.findOne({ eventId });

    if (!eventFinder)
      return res
        .status(400)
        .send({ status: false, msg: "no such event is present" });

    let { invitee, time } = req.body;

    if (!isValidObjectId(invitee) && !isValid(invitee))
      return res
        .status(400)
        .send({ status: false, msg: "please provide valid invite id" });

    if (!isValid(time))
      return res
        .status(400)
        .send({ status: false, msg: "please provide time" });

    let invitation = await EventModel.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { invitees: { invitee: invitee, time: time } } },
      { new: true }
    );

    return res.status(200).send({ status: true, data: invitation });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

//

const events = async (req, res) => {
  try {
    let { date, name, sort } = req.query;

    if (date) {
      let dateFilter = await EventModel.findOne({ eventDate: date });

      if (dateFilter.length !== 0) {
        return res.status(200).send({
          status: true,
          msg: "Successfully found",
          data: { dateFilter },
        });
      } else {
        return res
          .status(400)
          .send({ status: false, msg: `No event with ${date} found` });
      }
    }
    if (name) {
      let findName = await EventModel.find({
        title: { $regex: name, $options: "i" },
      });

      if (findName.length != 0) {
        return res.status(200).send({
          status: true,
          msg: "Successfully found",
          data: { findName },
        });
      } else {
        return res
          .status(400)
          .send({ status: false, msg: `No event with ${name} found` });
      }
    }

    if (sort) {
      let findSort = await EventModel.find({}).sort({ title: sort });

      if (findSort.length != 0) {
        return res.status(200).send({
          status: true,
          msg: "Successfully found",
          data: { findSort },
        });
      } else {
        return res
          .status(400)
          .send({ status: false, msg: `No products of size ${Size} found` });
      }
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

//

const updateEvent = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id))
      return res
        .status(400)
        .send({ status: false, message: "Invalid event id" });

    let findEvent = await EventModel.findOne({ _id: req.params.id });

    if (!findEvent)
      return res
        .status(400)
        .send({ status: false, message: "event does not exits" });

    let { creator, title, description, eventDate } = req.body;
    let { invitee, time } = req.body.invitees[0];

    if (!isValidRequestBody(req.body))
      return res.status(400).send({
        status: false,
        message: "Invalid request parameters. Please provide event details.",
      });

    if (!isValid(creator) && !isValidObjectId(creator))
      return res
        .status(400)
        .send({ status: false, msg: "please provide creator id" });

    if (!isValid(title))
      return res
        .status(400)
        .send({ status: false, msg: "please provide title" });

    if (!isValid(description))
      return res
        .status(400)
        .send({ status: false, msg: "please provide description" });

    if (!isValid(eventDate))
      return res
        .status(400)
        .send({ status: false, msg: "please provide event date" });

    if (!isValidObjectId(invitee) && !isValid(invitee))
      return res
        .status(400)
        .send({ status: false, msg: "please provide valid invite id" });

    if (!isValid(time))
      return res
        .status(400)
        .send({ status: false, msg: "please provide time" });

    let data = await EventModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );

    return res.status(200).send({
      status: true,
      message: `successfully updated`,
      data: data,
    });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

//

const details = async (req, res) => {
  try {
    let eventId = req.params.id;
    let getEvents = await EventModel.findOne({ eventId });

    if (!getEvents)
      return res.status(400).send({ status: false, msg: "no events found" });

    return res
      .status(200)
      .send({ status: false, msg: "events listed", data: getEvents });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports = { createEvent, invite, events, updateEvent, details };