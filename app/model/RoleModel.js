const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
       // e.g. "superadmin", "admin", "manager", "employee"
    },
    permissions: {
      type: [String], // e.g. ["create_user", "delete_task", "view_task"]
      default: [],
    },
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);
