const validate = (formdata) => {
    let errors = {};
    if (!formdata.name) {
        errors.name = "*Name is required";
    }
    if (!formdata.email) {
        errors.email = "*Email is required";
    }
    if (!formdata.password) {
        errors.password = "*Password is required";
    }
    if (formdata.password !== formdata.cpassword) {
        errors.cpassword = "*Password does not match";
    }

    return errors;
};

export default validate