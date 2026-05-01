#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { convertToPostman } from "./postman-mapper.js"

const program = new Command();

program
  .name('postman-simplified')
  .description('CLI to transform captured API logs into Postman Collections')
  .version('1.0.2');



program
  .command('export')
  .description('Converts your json request file to a Postman collection')
  .argument('<input>', 'path to the captured json file')
  .option('-o, --output <filename>', 'custom output filename', 'collection.postman_json')
  .action((input, options) => {
    const inputPath = path.resolve(input);
    
    if (!fs.existsSync(inputPath)) {
        console.log(chalk.red(`\nError: The requested file not found at ${inputPath}`));
        process.exit(1);
    }

    console.log(chalk.blue('Starting conversion to collection ...'));

    try {
        const rawData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
        
        const postmanCollection = convertToPostman(rawData);
        
        const outputPath = path.resolve(options.output);
        fs.writeFileSync(outputPath, JSON.stringify(postmanCollection, null, 2));

        console.log(chalk.green(`\nSuccess! Postman Collection exported to: ${outputPath}`));
    } catch (err) {
        console.error(chalk.red('Failed to export:'), err.message);
    }
  });

program.parse();