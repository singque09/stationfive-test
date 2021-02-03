import React, { useState } from "react";
import {
  Button,
  FormControlLabel,
  FormLabel,
  Grid,
  makeStyles,
  Paper,
  Radio,
  RadioGroup
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import "./styles.css";

const dataList = {
  menus: [
    // first group of radio-buttons
    [
      { id: "101", value: "Vegetarian" },
      { id: "102", value: "Nut allergy" },
      { id: "103", value: "Halal" }
    ],
    // second group of radio-buttons
    [
      { id: "201", value: "Cashew chicken" },
      { id: "202", value: "Sweet and sour pork" },
      { id: "203", value: "Stir fried Tofu" },
      { id: "204", value: "Vegetable fried rice" },
      { id: "205", value: "Pad Thai" },
      { id: "206", value: "Massaman beef" }
    ],
    // third group of radio-buttons
    [
      { id: "301", value: "Peanut sauce" },
      { id: "302", value: "Oyster sauce" },
      { id: "303", value: "Vegetable spring rolls" },
      { id: "304", value: "Steamed rice" }
    ]
  ],
  rules: {
    // 'Vegetarian' is NOT compatible with 'Cashew chicken', 'Sweet and sour pork', 'Massaman beef', 'Oyster sauce'
    101: [201, 202, 206, 302],
    // 'Nut allergy' is NOT compatible with 'Cashew chicken', 'Peanut sauce',
    102: [201, 301],
    // 'Halal' is NOT compatible with 'Sweet and sour pork',
    103: [202],
    // 'Vegetable fried rice' is NOT compatible with 'Steamed rice' (you don't need more rice... carb overload),
    204: [304],
    // 'Pad thai' is NOT compatible with 'Steamed rice' (Pad thai comes with noodles),
    205: [304]
  }
};

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "30px",
    height: "270px",
    overflow: "hidden"
  },
  buttons: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  buttonsPaper: {
    padding: "30px",
    overflow: "hidden"
  }
}));

export default function App() {
  const classes = useStyles();
  const { handleSubmit, register, reset, clearErrors, errors } = useForm();
  const [radioGroupDisabled, setRadioGroupDisabled] = useState([
    false,
    true,
    true
  ]);
  const [currentRadioId, setCurrentRadioId] = useState([0, 0, 0]);
  const [answer, setAnswer] = useState();

  const handleAnswer = (index, radioId) => {
    setRadioGroupDisabled(
      radioGroupDisabled.map((val, idx) =>
        index === idx - 1 ? val && !val : val
      )
    );
    setCurrentRadioId(
      currentRadioId.map((val, idx) => (index === idx ? radioId : val))
    );
  };

  const checkRules = (radioId) => {
    if (dataList.rules[currentRadioId[0]]) {
      for (let x = 0; x < dataList.rules[currentRadioId[0]].length; x++) {
        if (Number(dataList.rules[currentRadioId[0]][x]) === Number(radioId))
          return true;
      }
    }
    if (dataList.rules[currentRadioId[1]]) {
      for (let x = 0; x < dataList.rules[currentRadioId[1]].length; x++) {
        if (dataList.rules[currentRadioId[1]][x] === Number(radioId)) {
          return true;
        }
      }
    }
    return false;
  };

  const onSubmit = (data) => {
    setAnswer(data);
  };

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <form>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={3}
      >
        {dataList.menus.map((radioGroup, idx) => (
          <Grid key={`radioGroup${idx}`} item xs={4}>
            <Paper className={classes.paper}>
              <FormLabel>Radio Group {idx + 1}</FormLabel>
              <RadioGroup aria-label="gender">
                {radioGroup.map((radio) => (
                  <FormControlLabel
                    key={radio.id}
                    value={radio.id}
                    control={<Radio />}
                    label={radio.value}
                    name={`radioGroup${idx}`}
                    disabled={radioGroupDisabled[idx] || checkRules(radio.id)}
                    onChange={() => handleAnswer(idx, radio.id)}
                    inputRef={register({ required: true })}
                  />
                ))}
              </RadioGroup>
            </Paper>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Paper className={classes.buttonsPaper}>
            <Button
              className={classes.buttons}
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
            >
              Submit
            </Button>
            <Button
              className={classes.buttons}
              variant="contained"
              color="secondary"
              type="reset"
              onClick={() => handleReset()}
            >
              Reset
            </Button>
            {answer ? `Your Answer: ${JSON.stringify(answer)}` : ""}
            {errors.radioGroup2?.type === "required" &&
              "Your input is required"}
          </Paper>
        </Grid>
      </Grid>
    </form>
  );
}
