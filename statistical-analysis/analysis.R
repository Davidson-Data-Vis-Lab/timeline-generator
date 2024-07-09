# import libraries
library(readxl)
library(dplyr)
library(purrr)
library(tidyverse)

# Function to process accuracy data
acc_sum <- function(df, prefix) {
  
  # select specific columns
  selected_columns <- df %>%
    select(matches(paste0("^", prefix, " - Q[1-6]$")))
  
  # converting character vectors to numeric
  data_numeric <- lapply(selected_columns, function(column) as.numeric(column))
  
  # list to store sums of each index across columns
  sums <- vector("list", length = length(data_numeric[[1]]))
  
  # calculate and store sums of each index across columns
  for (i in seq_along(data_numeric[[1]])) {
    sums[[i]] <- sum(map_dbl(data_numeric, ~ .x[i]), na.rm=TRUE)
  }
  
  return(sums)
}

# Function to process time data
time_sum <- function(df, prefix) {
  
  # select specific columns
  selected_columns <- df %>%
    select(matches(paste0("^", prefix, " - Q[1-6] Time_Page Submit$")))
  
  # converting character vectors to numeric
  data_numeric <- lapply(selected_columns, function(column) as.numeric(column))
  
  # list to store sums of each index across columns
  sums <- vector("list", length = length(data_numeric[[1]]))
  
  # calculate and store sums of each index across columns
  for (i in seq_along(data_numeric[[1]])) {
    sums[[i]] <- sum(map_dbl(data_numeric, ~ .x[i]), na.rm=TRUE)
  }
  
  return(sums)
}

#MAIN:

# Read data from data file
pilotDF <- read_excel("./data/pilot_analysis.xlsx")


# Process data
ELR12_sums <- acc_sum(pilotDF, "ELR[12]")

#ELR34_sums <- acc_sum(pilotDF, "ELR[34]")

ULR12_sums <- acc_sum(pilotDF, "ULR[12]")


# Print the sums for the third participant (index 3) (Test Case)
print(ELR12_sums[[3]])
print(ULR12_sums[[3]])


max_score <- 12

weight_acc <- function(sums, plot_title){
  #weighted accuracy for each participant
  weighted_accuracy <- unlist(sums) / max_score
  
  #data frame for plotting
  data <- data.frame(
    name = paste0("Participant ", 1:length(weighted_accuracy)),
    weighted_accuracy = weighted_accuracy
  )
  
  # Plot weighted accuracy
  ggplot(data, aes(x = name, y = weighted_accuracy)) + 
    geom_bar(stat = "identity") +
    labs(x = "Participant", y = "Weighted Accuracy", title = paste("Weighted Accuracy per Participant ", plot_title)
    ) +
    theme(axis.text.x = element_text(angle = 45, hjust = 1))
}

weight_acc(ULR12_sums, "ULR12")

