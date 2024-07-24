import AppSource from "../config/data-source.js";
import { config } from "dotenv";
config({ path: "../.env" });
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
console.log("controller", process.env.AWS_REGION);

export const upload = (base64, userName, uuid) => {
  const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });
  const buffer = Buffer.from(base64.split(",")[1], "base64");
  const file = base64.split(";")[0];
  const fileType = file.split(":")[1]; //"data:application/pdf;base64,JVBERi0xLjUKJb/".split(";")[0].split(':')[1]
  const extension = fileType.split("/")[1];
  const fileName = `${userName}` + `.${extension}`;

  // Convert base64 string to Buffer
  // const base64Data = base64.split(",")[1]//replace(/^data:application\/pdf;base64,/, "");
  // const buffer = Buffer.from(base64Data, "base64");

  s3.putObject(
    {
      Body: buffer, //base64, //data,
      Bucket: process.env.AWS_BUCKET,
      Key: `uploads/resume/${uuid}/${fileName}`, //uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
      ContentEncoding: "base64",
      ContentType: `${fileType}`, //"application/pdf", // Correct MIME type for PDF files", // `${fileType}`,
      ACL: "public-read", //public-read
    },
    (error, success) => {
      if (error) {
        console.log(error);
      } else console.log(success);
    }
  );
  return `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/resume/${uuid}/${fileName}`;
};
const ApplicationController = async (req, res) => {
  // console.log(req.body);

  try {
    // Small form Application
    if (Object.keys(req.body).length < 7) {
      const validationErrors = validateInputForSmall_Application(req.body);
      if (Object.keys(validationErrors).length !== 0) {
        console.log("validationErrors", validationErrors);
        return res.status(400).json({ status: 400, errors: validationErrors });
      }

      console.log("validation passed");

      const small_ApplicationRepository =
        AppSource.getRepository("Small_Application");

      // Assuming you have a model named Application for database interactions
      const validSmall_Application = await small_ApplicationRepository.findOne({
        where: { email: req.body.email },
      });
      console.log("validSmall_Application", validSmall_Application);

      if (!validSmall_Application) {
        let small_application = {};
        small_application = {
          ...req.body,
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mobile,
          total_attempts: Number(req.body.total_attempts),
          source: req.body.source || "eilp-upsc-web",
        };

        const applicationdata = await small_ApplicationRepository.save(
          small_application
        );
        console.log("applicationdata", applicationdata);

        res.status(201).json({
          status: 200,
          message: "Thank you for your application.",
        });
      } else {
        res.status(400).json({
          status: 400,
          errors: "An application already exists with this email address",
        });
      }
      return;
    }

    // Large form Application
    const validationErrors = validateInput(req.body);
    if (Object.keys(validationErrors).length !== 0) {
      console.log("validationErrors", validationErrors);
      return res.status(400).json({
        status: 400,
        errors: validationErrors,
      });
    }

    console.log("validation passed");

    const applicationRepository = AppSource.getRepository("Application");

    // Assuming you have a model named Application for database interactions
    const validApplication = await applicationRepository.findOne({
      where: { email: req.body.email },
    });
    console.log("validApplication", validApplication);

    // const abc = await applicationRepository.findOne({ where: { id: 5 } });
    // console.log(abc, "abc", abc.state, "internship", JSON.parse(abc.state));
    //validation on data

    if (!validApplication) {
      //upload resume
      const resume_uuid = uuidv4();
      let uploaded_url = null;
      try {
        uploaded_url = upload(
          req.body.resume,
          req.body.first_name + "_" + req.body.last_name,
          resume_uuid
        );
      } catch (error) {
        console.log("error", error);
        return res.status(500).json({
          status: 500,
          errors: "Something went wrong, while uploading resume pdf",
        });
      }

      //upload extracurricular activities doc proof
      const extra_curricular_uuid = uuidv4();
      let proof_document = null;
      try {
        proof_document = upload(
          req.body.extra_curricular_proof_document,
          req.body.first_name + "_" + req.body.last_name,
          extra_curricular_uuid
        );
      } catch (error) {
        console.log("error", error);
        return res.status(500).json({
          status: 500,
          errors:
            "Something went wrong, while uploading extracurricular proof_document pdf",
        });
      }
      // const extra_curricular_obj = {
      //   ...req.body.extra_curricular,
      //   proof_document: proof_document,
      //   proof_document_uuid: extra_curricular_uuid,
      // };

      // upload upsc_scorecard

      const upsc_scorecard_uuid = uuidv4();
      let upsc_scorecard = null;
      try {
        upsc_scorecard = upload(
          req.body.upsc_scorecard,
          req.body.first_name + "_" + req.body.last_name,
          upsc_scorecard_uuid
        );
      } catch (error) {
        console.log("error", error);
        return res.status(500).json({
          status: 500,
          errors: "Something went wrong, while uploading upsc_scorecard pdf",
        });
      }

      let application = {};
      application = {
        ...req.body,
        professional_experience: JSON.stringify(req.body.internship),
        // extra_curricular: JSON.stringify(extra_curricular_obj),
        source: req.body.source || "eilp-upsc-web",
        resume: uploaded_url,
        resume_uuid: resume_uuid,

        extra_curricular_proof_document: proof_document,
        extra_curricular_proof_document_uuid: extra_curricular_uuid,

        upsc_scorecard: upsc_scorecard,
        upsc_uuid: upsc_scorecard_uuid,

        // s3_prefix: "https://eilp.s3.ap-south-1.amazonaws.com/uploads/resume",
        // resume: req.file ? req.file.filename : null,
        // source: req.body.source || "eilp-web-web",
        // ip_address: req.ip,
        // user_agent: req.headers['user-agent']
      };

      //save data
      const applicationdata = await applicationRepository.save(application);
      console.log("application data", applicationdata);

      res.status(201).json({
        status: 200,
        message: "Thank you for your application.",
      });
    } else {
      res.status(400).json({
        status: 400,
        errors: "An application already exists with this email address",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      errors: "Internal Server Error",
    });
  }
};

export { ApplicationController };
// app.post('/api/v1/entries/new', upload.single('resume'), async (req, res) => {

// });
// const userRepository = dataSource.getRepository(User);

// let user = new User();
// user.name = "John Doe";
// await userRepository.save(user);

// let users = await userRepository.find();
// console.log(users);

function validateInput(input) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[6-9][0-9]{9}$/;
  const nameRegex = /^[a-zA-Z]+(\s+[a-zA-Z]+)*$/;
  const postalCodeRegex = /^\d{6}$/;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const gpaRegex = /^(10(\.0{1,2})?|[0-9](\.\d{1,2})?)$/;
  const percentageRegex = /^([0-9]|[1-9][0-9]|100)(\.[0-9]{1,2})?$/;
  const gender = ["Male", "Female", "Others"];
  const marital_status = ["Married", "Unmarried", "Divorced", "Others"];
  const yesOrNo = ["Yes", "No"];
  const errors = {};

  // personal information

  if (!input.first_name || !nameRegex.test(input.first_name)) {
    errors.first_name =
      "Invalid first name format. Only alphabets and spaces are allowed.";
  }

  if (!input.last_name || !nameRegex.test(input.last_name)) {
    errors.last_name =
      "Invalid last name format. Only alphabets and spaces are allowed.";
  }

  if (!input.email || !emailRegex.test(input.email)) {
    errors.email = "Invalid email format.";
  }

  if (!input.dob || !dateRegex.test(input.dob)) {
    errors.dob = "Invalid date of birth format. Must be YYYY-MM-DD.";
  }

  if (
    !input.mobile ||
    !/^\d{10}$/.test(input.mobile) ||
    !mobileRegex.test(input.mobile)
  ) {
    errors.mobile =
      "Invalid mobile format. Must be a 10-digit number starting with 6-9.";
  }

  if (!input.gender || !gender.includes(input.gender)) {
    errors.gender = "Invalid gender.";
  }

  if (!input.marital_status || !marital_status.includes(input.marital_status)) {
    errors.marital_status = "Invalid marital status.";
  }

  // string fields
  if (
    // !input.languages ||
    !input.street_address ||
    !input.city ||
    !input.state ||
    // !input.country ||
    !input.education ||
    // !input.other_institute ||
    // !input.course ||
    !input.degree ||
    !input.resume ||
    !input.correct_fit ||
    !input.about_nation_building ||
    !input.higher_education ||
    // !input.languages.trim() ||
    !input.street_address.trim() ||
    !input.city.trim() ||
    !input.state.trim() ||
    // !input.country.trim() ||
    !input.education.trim() ||
    // !input.other_institute.trim() ||
    // !input.course.trim() ||
    !input.degree.trim() ||
    !input.resume.trim() ||
    !input.correct_fit.trim() ||
    !input.about_nation_building.trim() ||
    !input.higher_education.trim()
  ) {
    errors.textInputFields = "Your input cannot be empty and whitespace only .";
  }

  // address information
  if (!input.postal_code || !postalCodeRegex.test(input.postal_code)) {
    errors.postal_code =
      "Invalid postal code format. Must be a 6-digit number.";
  }

  // education information
  if (!input.start_date || !dateRegex.test(input.start_date)) {
    errors.start_date = "Invalid start date format. Must be YYYY-MM-DD.";
  }

  if (!input.end_date || !dateRegex.test(input.end_date)) {
    errors.end_date = "Invalid end date format. Must be YYYY-MM-DD.";
  }

  if (!input.gpa || !gpaRegex.test(input.gpa)) {
    errors.gpa = "Invalid GPA format. Range between 0 and 10 or 0.00 to 10.00.";
  }

  if (
    !input.tenth_percentage ||
    !percentageRegex.test(input.tenth_percentage)
  ) {
    errors.tenth_percentage =
      "Invalid tenth percentage format. Must be a number between 0 and 100.";
  }

  if (
    !input.twelfth_percentage ||
    !percentageRegex.test(input.twelfth_percentage)
  ) {
    errors.twelfth_percentage =
      "Invalid twelfth percentage format. Must be a number between 0 and 100.";
  }

  // professional information
  // if (input.professional_experience) {
  //   const exp = input.professional_experience;
  //   if (Object.keys(exp).length === 6) {
  if (
    !input.professional_experience_from ||
    !dateRegex.test(input.professional_experience_from)
  ) {
    errors[`professional_experience.from`] =
      "Invalid professional_experience start date format. Must be YYYY-MM-DD.";
  }
  if (
    !input.professional_experience_to ||
    !dateRegex.test(input.professional_experience_to)
  ) {
    errors[`professional_experience.to`] =
      "Invalid professional_experience end date format. Must be YYYY-MM-DD.";
  }
  if (
    !input.professional_experience_organisation ||
    typeof input.professional_experience_organisation !== "string" ||
    !input.professional_experience_organisation.trim()
  ) {
    errors[`professional_experience.organisation`] =
      "Invalid exp organisation name, must be string without trials whitespaces.";
  }
  if (
    !input.professional_experience_title ||
    typeof input.professional_experience_title !== "string" ||
    !input.professional_experience_title.trim()
  ) {
    errors[`professional_experience.title`] =
      "Invalid exp title name, must be string without trials whitespaces.";
  }
  if (
    !input.professional_experience_status ||
    typeof input.professional_experience_status !== "string" ||
    !input.professional_experience_status.trim()
  ) {
    errors[`professional_experience.status`] =
      "Invalid exp status name, must be string without trials whitespaces.";
  }
  if (
    !input.professional_experience_sector ||
    typeof input.professional_experience_sector !== "string" ||
    !input.professional_experience_sector.trim()
  ) {
    errors[`professional_experience.sector`] =
      "Invalid exp sector name, must be string without trials whitespaces.";
  }
  //   } else {
  //     errors.professional_experience =
  //       "Please add all 6 fields of professional experience.";
  //   }
  // } else {
  //   errors.professional_experience = "Please add professional experience.";
  // }

  // if (input.extra_curricular) {
  //   const activity = input.extra_curricular;
  //   if (Object.keys(activity).length === 5) {
  if (
    !input.extra_curricular_description ||
    typeof input.extra_curricular_description !== "string"
  ) {
    errors[`extra_curricular.description`] =
      "Invalid extra_curricular description.";
  }
  if (
    !input.extra_curricular_position ||
    typeof input.extra_curricular_position !== "string"
  ) {
    errors[`extra_curricular.position`] = "Invalid extra_curricular position.";
  }
  if (
    !input.extra_curricular_from ||
    typeof input.extra_curricular_from !== "string"
  ) {
    errors[`extra_curricular.from`] = "Invalid extra_curricular start date.";
  }
  if (
    !input.extra_curricular_to ||
    typeof input.extra_curricular_to !== "string"
  ) {
    errors[`extra_curricular.to`] = "Invalid extra_curricular end date.";
  }
  if (
    !input.extra_curricular_proof_document ||
    typeof input.extra_curricular_proof_document !== "string"
  ) {
    errors[`extra_curricular.proof_document`] =
      "Invalid extra_curricular proof_document.";
  }
  //   } else {
  //     errors.extra_curricular =
  //       "Please add  all 5 fields of  extra_curricular activities.";
  //   }
  // }

  //   Additional Information

  if (
    !input.short_term_deployment ||
    !yesOrNo.includes(input.short_term_deployment)
  ) {
    errors.short_term_deployment = "Please select yes or no.";
  }

  if (!input.field_travel || !yesOrNo.includes(input.field_travel)) {
    errors.field_travel = "Please select yes or no.";
  }

  if (!input.six_day || !yesOrNo.includes(input.six_day)) {
    errors.six_day = "Please select yes or no.";
  }

  // upsc
  // if (input.upsc) {
  //   const activity = input.upsc;
  //   if (Object.keys(activity).length === 5) {
  if (!input.upsc_total_attempts || isNaN(input.upsc_total_attempts)) {
    errors[`upsc_total_attempts`] = "Invalid upsc total_attempts.";
  }
  if (!input.upsc_totat_score || isNaN(input.upsc_totat_score)) {
    errors[`upsc_totat_score`] = "Invalid upsc totat_score.";
  }
  if (!input.upsc_year || isNaN(input.upsc_year)) {
    errors[`upsc_year`] = "Invalid upsc year.";
  }
  if (
    !input.upsc_stage_qualified ||
    typeof input.upsc_stage_qualified !== "string"
  ) {
    errors[`upsc_stage_qualified`] = "Invalid upsc stage_qualified.";
  }
  if (!input.upsc_scorecard || typeof input.upsc_scorecard !== "string") {
    errors[`upsc_scorecard`] = "Invalid upsc scorecard.";
  }

  //source and resume

  return errors;
}

function validateInputForSmall_Application(input) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[6-9][0-9]{9}$/;
  const nameRegex = /^[a-zA-Z]+(\s+[a-zA-Z]+)*$/;
  const errors = {};

  // personal information

  if (!input.name || !nameRegex.test(input.name)) {
    errors.name =
      "Invalid first name format. Only alphabets and spaces are allowed.";
  }

  if (!input.email || !emailRegex.test(input.email)) {
    errors.email = "Invalid email format.";
  }
  if (
    !input.mobile ||
    !/^\d{10}$/.test(input.mobile) ||
    !mobileRegex.test(input.mobile)
  ) {
    errors.mobile =
      "Invalid mobile format. Must be a 10-digit number starting with 6-9.";
  }

  if (!input.total_attempts || isNaN(input.total_attempts)) {
    errors.total_attempts = "Invalid total_attempts value, must be a Number.";
  }

  return errors;
}

// Example usage
// const input = {
//   email: "test@example.com",
//   mobile: "9876543210",
//   firstName: "John",
//   lastName: "Doe"
// };

// const validationErrors = validateInput(input);

// if (Object.keys(validationErrors).length === 0) {
//   console.log("All inputs are valid.");
// } else {
//   console.log("Validation errors:", validationErrors);
// }
