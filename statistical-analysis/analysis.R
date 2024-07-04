# import libraries
library(readxl)
library(dplyr)
library(purrr)
library(tidyverse)

# Function to process specific columns
process_data <- function(df, prefix) {
  
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

# Read data from data file
pilotDF <- read_excel("./data/pilot_analysis.xlsx")


# Process data
ELR12_sums <- process_data(pilotDF, "ELR[12]")

ELR34_sums <- process_data(pilotDF, "ELR[34]")

ULR12_sums <- process_data(pilotDF, "ULR[12]")


# Print the sums for the third participant (index 3) (Test Case)
print(ELR12_sums[[3]])
print(ULR12_sums[[3]])


