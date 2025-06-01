using kiereshka.Models;
using System.Threading.Tasks;
using System.Linq;
using System;
using Microsoft.Extensions.Logging;

namespace kiereshka.Services
{
    public class OptimizationService
    {
        private readonly ILogger<OptimizationService> _logger;

        public OptimizationService(ILogger<OptimizationService> logger)
        {
            _logger = logger;
        }

        public Task<OptimizationResult> RunOptimization(OptimizationInput input)
        {
            _logger.LogInformation("Starting optimization with M={M}, N={N}", input.M, input.N);

            var result = new OptimizationResult
            {
                BestSolution = Enumerable.Repeat(0, input.N).ToList(),
                MaxCapacity = 0,
                ValidCoordinates = input.Locations.Select(l => new Coordinate { X = l.X, Y = l.Y }).ToList()
            };

            // Перевірка мінімальної дистанції (D) між точками
            foreach (var loc1 in input.Locations)
            {
                foreach (var loc2 in input.Locations)
                {
                    if (loc1 != loc2)
                    {
                        double distance = Math.Sqrt(Math.Pow(loc1.X - loc2.X, 2) + Math.Pow(loc1.Y - loc2.Y, 2));
                        if (distance < input.D)
                        {
                            throw new InvalidOperationException($"Відстань між локаціями ({loc1.X}, {loc1.Y}) і ({loc2.X}, {loc2.Y}) менша за мінімальну ({input.D}).");
                        }
                    }
                }
            }

            // Логіка вибору найкращого рішення (приклад)
            int remainingBudget = input.C;
            for (int i = 0; i < input.M; i++)
            {
                var location = input.Locations[i];
                for (int j = 0; j < input.N; j++)
                {
                    if (location.Costs[j] <= remainingBudget)
                    {
                        result.BestSolution[j] = 1; // Вибираємо RES
                        result.MaxCapacity += location.Capacities[j];
                        remainingBudget -= location.Costs[j];
                    }
                }
            }

            return Task.FromResult(result);
        }
    }
}