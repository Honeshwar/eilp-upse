import { EntitySchema } from "typeorm";

const Small_Application = new EntitySchema({
  name: "Small_Application",
  tableName: "Small_Application", // optional
  columns: {
    id: {
      type: Number, //int(11)
      primary: true,
      generated: true,
    },

    //Personal Information
    name: {
      type: String,
      default: null,
    },

    mobile: {
      type: "bigint",
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    total_attempts: {
      type: Number,
      default: null,
    },
    source: {
      type: String,
      default: null,
    },
  },
});

export default Small_Application;
