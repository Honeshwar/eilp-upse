import AppSource from "../config/data-source.js";

const EntryController = async (req, res) => {
  console.log(req.body);
  // res.status(200).json({
  //   message: "Your are at api/v1/entry",
  // });

  try {
    if (Object.keys(req.body).length < 7) {
      const validationErrors = validateInputSmallApplication(req.body);
      if (Object.keys(validationErrors).length !== 0) {
        console.log("validationErrors", validationErrors);
        return res.status(400).json({ status: 400, errors: validationErrors });
      }

      console.log("validation passed");

      const smallApplicationRepository =
        AppSource.getRepository("Small_Application");

      // Assuming you have a model named Application for database interactions
      const validApplication = await smallApplicationRepository.findOne({
        where: { email: req.body.email },
      });
      console.log("validApplication", validApplication);

      if (!validApplication) {
        let application = {};
        application = {
          ...req.body,
          internship: JSON.stringify(req.body.internship[0]),
          extracurricular: JSON.stringify(req.body.extracurricular),
          source: req.body.source || "eilp-web-web",

          // store_uuid: uuidv4(),
          // s3_prefix: "https://eilp.s3.ap-south-1.amazonaws.com/uploads/resume",
          // resume: req.file ? req.file.filename : null,
          // source: req.body.source || "eilp-web-web",
          // ip_address: req.ip,
          // user_agent: req.headers['user-agent']
        };
        const applicationdata = await smallApplicationRepository.save(
          application
        );
        console.log("applicationdata", applicationdata);

        //adding internship data to internship table
        const internRepository = AppSource.getRepository("Internship");
        const intern = {
          title: req.body.internship[0].title || null,
          organisation: req.body.internship[0].organisation || null,
          sector: req.body.internship[0].sector || null,
          status: req.body.internship[0].status || null,
          from: req.body.internship[0].from || null,
          to: req.body.internship[0].to || null,
          applicationId: applicationdata.id,
        };
        const i = await internRepository.save(intern);
        console.log("Internship", i);
        //adding extracurricular data to internship table
        const extracurricularRepository =
          AppSource.getRepository("Extracurricular");
        for (let item of req.body.extracurricular) {
          const extracurricular = {
            position: item.position || null,
            description: item.description || null,
            applicationId: applicationdata.id,
          };
          console.log("extracurricular", extracurricular);
          const e = await extracurricularRepository.save(extracurricular);
          console.log("Extracurricular", e);
        }
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
      let application = {};
      application = {
        ...req.body,
        internship: JSON.stringify(req.body.internship[0]),
        extracurricular: JSON.stringify(req.body.extracurricular),
        source: req.body.source || "eilp-web-web",

        // store_uuid: uuidv4(),
        // s3_prefix: "https://eilp.s3.ap-south-1.amazonaws.com/uploads/resume",
        // resume: req.file ? req.file.filename : null,
        // source: req.body.source || "eilp-web-web",
        // ip_address: req.ip,
        // user_agent: req.headers['user-agent']
      };
      const applicationdata = await applicationRepository.save(application);
      console.log("applicationdata", applicationdata);

      //adding internship data to internship table
      const internRepository = AppSource.getRepository("Internship");
      const intern = {
        title: req.body.internship[0].title || null,
        organisation: req.body.internship[0].organisation || null,
        sector: req.body.internship[0].sector || null,
        status: req.body.internship[0].status || null,
        from: req.body.internship[0].from || null,
        to: req.body.internship[0].to || null,
        applicationId: applicationdata.id,
      };
      const i = await internRepository.save(intern);
      console.log("Internship", i);
      //adding extracurricular data to internship table
      const extracurricularRepository =
        AppSource.getRepository("Extracurricular");
      for (let item of req.body.extracurricular) {
        const extracurricular = {
          position: item.position || null,
          description: item.description || null,
          applicationId: applicationdata.id,
        };
        console.log("extracurricular", extracurricular);
        const e = await extracurricularRepository.save(extracurricular);
        console.log("Extracurricular", e);
      }
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

export { EntryController };
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
  const percentageRegex = /^\d{1,2}(\.\d{1,2})?$/;
  const gender = ["Male", "Female", "Others"];
  const marital_status = ["Married", "Unmarried", "Divorced", "Others"];

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
    !input.languages ||
    !input.street_address ||
    !input.city ||
    !input.state ||
    !input.country ||
    !input.education ||
    !input.other_institute ||
    !input.course ||
    !input.degree ||
    !input.resume ||
    !input.languages.trim() ||
    !input.street_address.trim() ||
    !input.city.trim() ||
    !input.state.trim() ||
    !input.country.trim() ||
    !input.education.trim() ||
    !input.other_institute.trim() ||
    !input.course.trim() ||
    !input.degree.trim() ||
    !input.resume.trim()
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
  if (input.internship && Array.isArray(input.internship)) {
    input.internship.forEach((intern, index) => {
      if (!intern.from || !dateRegex.test(intern.from)) {
        errors[`internship[${index}].from`] =
          "Invalid internship start date format. Must be YYYY-MM-DD.";
      }
      if (!intern.to || !dateRegex.test(intern.to)) {
        errors[`internship[${index}].to`] =
          "Invalid internship end date format. Must be YYYY-MM-DD.";
      }
      if (
        !intern.organisation ||
        typeof intern.organisation !== "string" ||
        !intern.organisation.trim()
      ) {
        errors[`internship[${index}].organisation`] =
          "Invalid Intern organisation name, must be string without trials whitespaces.";
      }
      if (
        !intern.title ||
        typeof intern.title !== "string" ||
        !intern.title.trim()
      ) {
        errors[`internship[${index}].title`] =
          "Invalid Intern title name, must be string without trials whitespaces.";
      }
      if (
        !intern.status ||
        typeof intern.status !== "string" ||
        !intern.status.trim()
      ) {
        errors[`internship[${index}].status`] =
          "Invalid Intern status name, must be string without trials whitespaces.";
      }
      if (
        !intern.sector ||
        typeof intern.sector !== "string" ||
        !intern.sector.trim()
      ) {
        errors[`internship[${index}].sector`] =
          "Invalid Intern sector name, must be string without trials whitespaces.";
      }
    });
  } else {
    errors.internship = "Please add professional experience.";
  }

  if (input.extracurricular && Array.isArray(input.extracurricular)) {
    input.extracurricular.forEach((activity, index) => {
      if (!activity.description || typeof activity.description !== "string") {
        errors[`extracurricular[${index}].description`] =
          "Invalid extracurricular description.";
      }
      if (!activity.position || typeof activity.position !== "string") {
        errors[`extracurricular[${index}].position`] =
          "Invalid extracurricular position.";
      }
    });
  }

  //source and resume

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
