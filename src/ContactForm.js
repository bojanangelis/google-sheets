import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import "./ContactForm.css";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

function ContactForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [tableData, setTableData] = useState([]);
  const [totalSalaries, setTotalSalaries] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const total = tableData.reduce(
      (total, row) => (total = total + Number(row.salary)),
      0
    );
    setTotalSalaries(total);
  }, [tableData]);

  const fetchData = () => {
    axios
      .get("https://sheet.best/api/sheets/40dfb14c-9de2-42c8-8256-bf5de129a260")
      .then((response) => {
        setTableData(response.data);
      });
  };

  const submitFormToGoogle = ({ name, age, salary, hobby }) => {
    axios
      .post(
        "https://sheet.best/api/sheets/40dfb14c-9de2-42c8-8256-bf5de129a260",
        {
          name,
          age,
          salary,
          hobby,
        }
      )
      .then((response) => {
        alert("Row successfully added");
        // fetchData();
        setTableData([...tableData, { name, age, salary, hobby }]);
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div className="contact__form">
      <a href="https://docs.google.com/spreadsheets/d/1Ueiz3dxd51es7Fe6Qad2z3yrUdzhpfP97tyheRads6c/edit?usp=sharing">
        Sheets
      </a>
      <form onSubmit={handleSubmit(submitFormToGoogle)} className="app__form">
        {!watch("name") && <h5>Please fill out the form</h5>}
        <TextField
          helperText={
            errors.name?.type === "required" && "First name is required"
          }
          {...register("name", { required: true })}
          label="Name"
        />
        <TextField
          helperText={
            // (errors.age?.type === "validate" && "Age must be a number") ||
            errors.age?.type === "required" && "Age is required"
          }
          {...register("age", {
            required: true,
            // validate: (value) => typeof value === "number",
          })}
          //ne go iskoristiv od prvin ova number i se macev so number no
          //podobro e ova i za telefon type number ke ja vadi tastaturata za brojki
          //ne prima bukvi.
          type="number"
          label="Age"
        />

        <TextField
          helperText={
            errors.salary?.type === "required" && "Salary is required"
          }
          {...register("salary", { required: true })}
          label="Salary"
          type="number"
        />
        <TextField {...register("hobby")} label="Hobby" />
        <Button variant="outlined" type="submit">
          Submit
        </Button>
      </form>
      <h5 className="form__total">
        Annual expenses (Total salaries): ${totalSalaries}
      </h5>

      <table className="form__table">
        <tbody>
          {tableData.map(({ age, hobby, name, salary }) => (
            <tr>
              <td>{name}</td>
              <td>{age}</td>
              <td>{salary}</td>
              <td>{hobby}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ContactForm;
