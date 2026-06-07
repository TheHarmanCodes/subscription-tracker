import User from "../models/user.model.js";

export const getUsers = async (req, res, next) => {
  try {
    //const users = await User.find();
    // res.status(200).json({success: true, data: users});

    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit))) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find().select("-password").skip(skip).limit(limit);
    const total = await User.countDocuments();
    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
