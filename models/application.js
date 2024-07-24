import { EntitySchema } from "typeorm";

const Application = new EntitySchema({
  name: "Application",
  tableName: "Application", // optional
  columns: {
    id: {
      type: Number, //int(11)
      primary: true,
      generated: true,
    },

    //Personal Information
    first_name: {
      type: String,
      default: null,
    },
    last_name: {
      type: String,
      default: null,
    },
    dob: {
      type: String,
      default: null,
    },
    gender: {
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
    marital_status: {
      type: String,
      default: null,
    },
    // languages: {
    //   //see
    //   type: String,
    //   default: null,
    // },

    //Permanent Address Information
    street_address: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
    postal_code: {
      type: Number,
      default: null,
    },
    // country: {
    //   type: String,
    //   default: null,
    // },

    //Educational Information
    tenth_education_board: {
      type: String,
      default: null,
    },
    tenth_percentage: {
      type: Number,
      default: null,
    },
    twelfth_education_board: {
      type: String,
      default: null,
    },
    twelfth_percentage: {
      type: Number,
      default: null,
    },

    // degree//undergraduate
    education: {
      type: String,
      default: null,
    },
    higher_education: {
      type: String,
      default: null,
    },
    // other_institute: {
    //   type: String,
    //   default: null,
    // },
    degree: {
      type: String,
      default: null,
    },
    // course: {
    //   type: String,
    //   default: null,
    // },
    start_date: {
      type: String,
      default: null,
    },
    end_date: {
      type: String,
      default: null,
    },
    gpa: {
      type: Number,
      default: null,
    },
    //professional experience
    professional_experience_title: {
      type: String,
      default: null,
    },
    professional_experience_organisation: {
      type: String,
      default: null,
    },
    professional_experience_sector: {
      type: String,
      default: null,
    },
    professional_experience_status: {
      type: String,
      default: null,
    },
    professional_experience_from: {
      type: String,
      default: null,
    },
    professional_experience_to: {
      type: String,
      default: null,
    },

    // extra_curricular
    extra_curricular_position: {
      type: String,
      default: null,
    },
    extra_curricular_description: {
      type: String,
      default: null,
    },
    extra_curricular_from: {
      type: String,
      default: null,
    },
    extra_curricular_to: {
      type: String,
      default: null,
    },
    extra_curricular_proof_document: {
      type: String,
      default: null,
    },
    extra_curricular_proof_document_uuid: {
      type: String,
      default: null,
    },

    // resume
    resume: {
      type: String,
      default: null,
    },
    resume_uuid: {
      type: String,
      default: null,
    },
    //source
    source: {
      type: String,
      default: null,
    },

    //upsc
    upsc_total_attempts: {
      type: String,
      default: null,
    },
    upsc_totat_score: {
      type: String,
      default: null,
    },
    upsc_year: {
      type: String,
      default: null,
    },
    upsc_stage_qualified: {
      type: String,
      default: null,
    },
    upsc_scorecard: {
      type: String,
      default: null,
    },
    upsc_uuid: {
      type: String,
      default: null,
    },

    // About the National Building
    about_nation_building: {
      type: String,
      default: null,
    },

    // relation
    // internshipshipId: { type: Array, nullable: false }, // Foreign key
    // ExtracurricularId: { type: Array, nullable: false }, // Foreign key
  },
  // relations: ["Internship", "Extracurricular"], // Define the relation here
});

export default Application;
