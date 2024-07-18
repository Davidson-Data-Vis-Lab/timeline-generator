### LEFT-RIGHT

Uses functions defined above to aggregate data - time and accuracy sums - for the English Left-Right orientation. Implements the **Shapiro Wilk test** to determine if data is normally distributed, assuming alpha = 0.05.

\*Uses columns **ELR1 and ELR2** in dataset for this purpose.

```{r}
#Calculating weighted accuracy
ELR12_acc <- acc_sum(pilotDF, "ELR[12]")
#print("LR Accuracy Normality Check")
shapiro.test(ELR12_acc)

#Summing times
ELR12_time <- time_sum(pilotDF, "ELR[12]")
shapiro.test(ELR12_time)

#creating df
ELR12_df <- data.frame(
  p_id = participant_ID,
  metric = rep(c("time", "accuracy"), each=eng_primary_size),
  value = c(ELR12_time,ELR12_acc)
)

# box blot distribution
#box_plot(ELR12_df)
```

### RIGHT - LEFT

Uses functions defined above to aggregate data - time and accuracy sums - for the English Right-Left orientation. Implements the **Shapiro Wilk test** to determine if data is normally distributed, assuming alpha = 0.05.

\*Uses columns **ERL1 and ERL2** in dataset for this purpose.

```{r}
#Calculating weighted accuracy
ERL12_acc <- acc_sum(pilotDF, "ERL[12]")
#print("RL Accuracy Normality Check")
shapiro.test(ERL12_acc)

#Summing times
ERL12_time <- time_sum(pilotDF, "ERL[12]")
#print("RL Time Normality Check")
shapiro.test(ERL12_time)

#creating df for plot
ERL12_df <- data.frame(
  p_id = participant_ID,
  metric = rep(c("time", "accuracy"), each=eng_primary_size),
  value = c(ERL12_time, ERL12_acc)
)

# box blot distribution
#box_plot(ERL12_df)
```

### TOP - BOTTOM

Uses functions defined above to aggregate data - time and accuracy sums - for the English Top-Bottom orientation. Implements the **Shapiro Wilk test** to determine if data is normally distributed, assuming alpha = 0.05.

\*Uses columns **ETB1 and ETB2** in dataset for this purpose.

```{r}
#Calculating weighted accuracy
ETB12_acc <- acc_sum(pilotDF, "ETB[12]")
#print("TB Accuracy Normality Check")
shapiro.test(ETB12_acc)

#Summing times
ETB12_time <- time_sum(pilotDF, "ETB[12]")
#print("TB Time Normality Check")
shapiro.test(ETB12_time)

#creating df for plot
ETB12_df <- data.frame(
  p_id = participant_ID,
  metric = rep(c("time", "accuracy"), each=eng_primary_size),
  value = c(ETB12_time, ETB12_acc)
)

# box blot distribution
#box_plot(ERL12_df)
```

#### Bar Plot(s) [extra]

```{r echo=FALSE}

mean_time_data <- data.frame(
  orientation=c("LR","TB","RL"),
  metric = c(mean(ELR12_time, na.rm = TRUE), mean(ETB12_time, na.rm = TRUE), mean(ERL12_time, na.rm = TRUE))
)

mean_acc_data <- data.frame(
  orientation=c("LR","TB","RL"),
  metric = c(mean(ELR12_acc, na.rm = TRUE), mean(ETB12_acc, na.rm = TRUE), mean(ERL12_acc, na.rm = TRUE))
)

bar_plot(mean_time_data,paste("Mean of Time Spent (in seconds) - English; participants:", eng_primary_size))
bar_plot(mean_acc_data, paste("Mean of Scored Accuracy - English; participants:", eng_primary_size))
```

### Merging Data (LR, RL, TB)

Merging data from all three orientations in to one data frame for statistical t-testing. A preview of how the frame looks like can be seen below.

```{r echo=FALSE}
# Merge the data frames
df_ENG_ALL <- ELR12_df %>%
  rename(value_LR = value) %>%
  full_join(ERL12_df %>% rename(value_RL = value), by = c("p_id", "metric")) %>%
  full_join(ETB12_df %>% rename(value_TB = value), by = c("p_id", "metric"))

# display merged data frame
head(df_ENG_ALL)

```