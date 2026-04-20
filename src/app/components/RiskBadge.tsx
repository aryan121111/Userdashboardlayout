interface RiskBadgeProps {
  level: 'High' | 'Medium' | 'Low';
  score?: number;
  showScore?: boolean;
}

export function RiskBadge({ level, score, showScore = false }: RiskBadgeProps) {
  const getStyles = () => {
    switch (level) {
      case 'High':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getEmoji = () => {
    switch (level) {
      case 'High':
        return '🔴';
      case 'Medium':
        return '🟡';
      case 'Low':
        return '🟢';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStyles()}`}>
      <span>{getEmoji()}</span>
      {level}
      {showScore && score !== undefined && (
        <span className="ml-1 opacity-75">({score})</span>
      )}
    </span>
  );
}
