import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  FontSpec,
} from 'chart.js';
import type { InfographicData } from '../../types';

ChartJS.register(
    ArcElement, 
    Tooltip, 
    Legend, 
    CategoryScale, 
    LinearScale, 
    BarElement,
    Title
);

// Global Chart.js options for styling
ChartJS.defaults.color = '#A0AEC0'; // Default text color for legends, etc.
ChartJS.defaults.font.family = "'Kanit', sans-serif";
ChartJS.defaults.plugins.legend.position = 'bottom';
ChartJS.defaults.plugins.tooltip.backgroundColor = '#2D3748';

const InteractiveInfographic: React.FC<{ infographicData: InfographicData }> = ({ infographicData }) => {
    
    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Policy Credibility Score',
                color: '#CBD5E0',
                font: {
                    size: 16,
                    weight: 'bold' as const
                }
            }
        }
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Public Sentiment',
                color: '#CBD5E0',
                font: {
                    size: 16,
                    weight: 'bold' as const
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: '#4A5568'
                },
                ticks: {
                    color: '#A0AEC0',
                }
            },
            y: {
                grid: {
                    color: '#4A5568'
                },
                ticks: {
                    color: '#A0AEC0',
                    callback: function(value: string | number) {
                        return value + '%';
                    }
                }
            }
        }
    };

    // FIX: The type of a chart data point can be an object, which cannot be rendered by React.
    // Ensure that credibilityScore is a number before rendering.
    const credibilityScoreValue = infographicData.charts.credibilityScore.data.datasets[0].data[0];
    const credibilityScore = typeof credibilityScoreValue === 'number' ? credibilityScoreValue : 0;

    return (
        <div className="p-4 bg-zinc-900/50 rounded-lg">
            <h3 className="text-xl font-bold text-center text-white mb-4">{infographicData.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 flex flex-col items-center justify-center p-4 bg-zinc-800 rounded-lg">
                    <div className="relative w-48 h-48">
                        <Doughnut data={infographicData.charts.credibilityScore.data} options={doughnutOptions} />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-4xl font-bold text-orange-400">{credibilityScore}</span>
                        </div>
                    </div>
                </div>
                <div className="md:col-span-2 p-4 bg-zinc-800 rounded-lg">
                    <div className="h-64">
                         <Bar data={infographicData.charts.publicSentiment.data} options={barOptions} />
                    </div>
                </div>
            </div>
             <div className="mt-6 p-4 bg-zinc-800 rounded-lg">
                <h4 className="text-md font-bold text-orange-400 mb-2">Key Strategic Takeaways</h4>
                <ul className="list-disc list-outside pl-5 space-y-2 text-gray-300">
                    {infographicData.keyTakeaways.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default InteractiveInfographic;