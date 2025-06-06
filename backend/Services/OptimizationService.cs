using kiereshka.Models;
using System.Threading.Tasks;
using System.Linq;
using System;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace kiereshka.Services
{
    public class OptimizationService
    {
        private readonly ILogger<OptimizationService> _logger;
        private Random random = new Random();

        public OptimizationService(ILogger<OptimizationService> logger)
        {
            _logger = logger;
        }

        public Task<OptimizationResult> RunOptimization(OptimizationInput input)
        {
            _logger.LogInformation("Running Genetic Algorithm for optimization.");
            int populationSize = 100;
            int generations = 200;
            double mutationRate = 0.05;

            List<int[]> population = GenerateInitialPopulation(input, populationSize);

            int[] bestSolution = null;
            double bestFitness = double.MinValue;

            for (int gen = 0; gen < generations; gen++)
            {
                var evaluated = population
                    .Select(ind => new { Individual = ind, Fitness = EvaluateFitness(ind, input) })
                    .OrderByDescending(x => x.Fitness)
                    .ToList();

                if (evaluated.Count > 0 && evaluated[0].Fitness > bestFitness)
                {
                    bestFitness = evaluated[0].Fitness;
                    bestSolution = evaluated[0].Individual;
                }

                population = Reproduce(
                    evaluated.Take(populationSize / 2).Select(x => x.Individual).ToList(),
                    input,
                    mutationRate
                );
            }

            if (bestSolution == null)
            {
                bestSolution = new int[input.N]; // Усі вимкнені
            }

            var result = new OptimizationResult
            {
                BestSolution = bestSolution.ToList(),
                MaxCapacity = CalculateCapacity(bestSolution, input),
                TotalCost = CalculateCost(bestSolution, input),
                ValidCoordinates = input.Locations.Select(p => new Coordinate { X = p.X, Y = p.Y }).ToList(),
                ConflictedIndices = GetConflictedIndices(bestSolution)
            };

            return Task.FromResult(result);
        }

        private List<int[]> GenerateInitialPopulation(OptimizationInput input, int size)
        {
            var population = new List<int[]>();
            for (int i = 0; i < size; i++)
            {
                var individual = new int[input.N];
                for (int j = 0; j < input.N; j++)
                    individual[j] = random.NextDouble() < 0.5 ? 1 : 0;
                population.Add(individual);
            }
            return population;
        }

        private double EvaluateFitness(int[] individual, OptimizationInput input)
        {
            if (!IsFeasible(individual, input)) return -1;
            return CalculateCapacity(individual, input);
        }

        private bool IsFeasible(int[] individual, OptimizationInput input)
        {
            double totalCost = CalculateCost(individual, input);
            if (totalCost > input.C)
                return false;

            for (int i = 0; i < input.M; i++)
            {
                for (int j = i + 1; j < input.M; j++)
                {
                    var a = input.Locations[i];
                    var b = input.Locations[j];
                    double dist = Math.Sqrt(Math.Pow(a.X - b.X, 2) + Math.Pow(a.Y - b.Y, 2));

                    if (dist < input.D)
                    {
                        for (int k = 0; k < input.N; k++)
                        {
                            if (individual[k] == 1 &&
                                a.Capacities[k] > 0 &&
                                b.Capacities[k] > 0)
                            {
                                return false; // просто return false — без жодного throw
                            }
                        }
                    }
                }
            }

            return true;
        }

        private double CalculateCost(int[] individual, OptimizationInput input)
        {
            double total = 0;
            for (int j = 0; j < input.N; j++)
            {
                if (individual[j] == 1)
                {
                    for (int i = 0; i < input.M; i++)
                        total += input.Locations[i].Costs[j];
                }
            }
            return total;
        }

        private double CalculateCapacity(int[] individual, OptimizationInput input)
        {
            double total = 0;
            for (int j = 0; j < input.N; j++)
            {
                if (individual[j] == 1)
                {
                    for (int i = 0; i < input.M; i++)
                        total += input.Locations[i].Capacities[j];
                }
            }
            return total;
        }

        private List<int[]> Reproduce(List<int[]> parents, OptimizationInput input, double mutationRate)
        {
            var children = new List<int[]>();
            while (children.Count < parents.Count * 2)
            {
                var a = parents[random.Next(parents.Count)];
                var b = parents[random.Next(parents.Count)];
                var child = new int[input.N];
                for (int i = 0; i < input.N; i++)
                    child[i] = random.NextDouble() < 0.5 ? a[i] : b[i];

                for (int i = 0; i < input.N; i++)
                    if (random.NextDouble() < mutationRate)
                        child[i] = 1 - child[i];

                children.Add(child);
            }
            return children;
        }

        private List<int> GetConflictedIndices(int[] bestSolution)
        {
            var list = new List<int>();
            for (int i = 0; i < bestSolution.Length; i++)
                if (bestSolution[i] == 0)
                    list.Add(i);
            return list;
        }
    }
}
