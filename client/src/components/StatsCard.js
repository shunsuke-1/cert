import React from 'react';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = 'blue',
  size = 'md' 
}) => {
  const getColorClasses = () => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 text-blue-600',
      purple: 'from-purple-500 to-purple-600 text-purple-600',
      pink: 'from-pink-500 to-pink-600 text-pink-600',
      green: 'from-green-500 to-green-600 text-green-600',
      yellow: 'from-yellow-500 to-yellow-600 text-yellow-600',
      red: 'from-red-500 to-red-600 text-red-600'
    };
    return colors[color] || colors.blue;
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-4';
      case 'lg':
        return 'p-8';
      default:
        return 'p-6';
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') return '📈';
    if (trend === 'down') return '📉';
    return '➡️';
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className={`card-modern ${getSizeClasses()} hover-lift group`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${getColorClasses().split(' ')[0]} ${getColorClasses().split(' ')[1]} rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-200`}>
          {icon}
        </div>
        {trend && trendValue && (
          <div className={`flex items-center space-x-1 text-sm ${getTrendColor()}`}>
            <span>{getTrendIcon()}</span>
            <span className="font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      
      <div>
        <div className={`text-3xl font-bold ${getColorClasses().split(' ')[2]} mb-2 group-hover:scale-105 transition-transform duration-200`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="text-gray-600 font-medium text-sm">
          {title}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;