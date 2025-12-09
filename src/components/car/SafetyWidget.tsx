interface SafetyProps {
  safety: {
    overallRating: string;
    frontalCrashRating: string;
    sideCrashRating: string;
    rolloverRating: string;
  } | null;
  recalls: Array<{
    campaignNumber: string;
    component: string;
    summary: string;
    remedy: string;
  }>;
  complaints: Array<{
    component: string;
    summary: string;
    crash: boolean;
  }>;
}

export const SafetyWidget = ({ safety, recalls, complaints }: SafetyProps) => {
  const renderStars = (rating: string) => {
    const numRating = parseInt(rating) || 0;
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className={`text-lg ${star <= numRating ? 'text-yellow-400' : 'text-slate-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Safety Ratings */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-primary mb-6 flex items-center gap-2">
          <span>🛡️</span> NHTSA Safety Ratings
        </h3>
        
        {safety ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-white/50 rounded-xl">
              <p className="text-sm text-slate-500 mb-2">Overall</p>
              {renderStars(safety.overallRating)}
              <p className="text-xs text-slate-400 mt-1">{safety.overallRating}/5 Stars</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-xl">
              <p className="text-sm text-slate-500 mb-2">Frontal Crash</p>
              {renderStars(safety.frontalCrashRating)}
              <p className="text-xs text-slate-400 mt-1">{safety.frontalCrashRating}/5 Stars</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-xl">
              <p className="text-sm text-slate-500 mb-2">Side Crash</p>
              {renderStars(safety.sideCrashRating)}
              <p className="text-xs text-slate-400 mt-1">{safety.sideCrashRating}/5 Stars</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-xl">
              <p className="text-sm text-slate-500 mb-2">Rollover</p>
              {renderStars(safety.rolloverRating)}
              <p className="text-xs text-slate-400 mt-1">{safety.rolloverRating}/5 Stars</p>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">
            No NHTSA safety ratings available for this vehicle.
          </p>
        )}
      </div>

      {/* Recalls */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
          <span>⚠️</span> Recalls ({recalls.length})
        </h3>
        
        {recalls.length > 0 ? (
          <div className="space-y-4">
            {recalls.map((recall, i) => (
              <div key={i} className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-orange-800 mb-1">{recall.component}</p>
                    <p className="text-sm text-orange-700 mb-2">{recall.summary}</p>
                    {recall.remedy && (
                      <p className="text-sm text-green-700">
                        <span className="font-medium">Remedy:</span> {recall.remedy}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-orange-500 whitespace-nowrap">
                    #{recall.campaignNumber}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <span className="text-4xl mb-2 block">✅</span>
            <p className="text-green-600 font-medium">No recalls found</p>
            <p className="text-sm text-slate-500 mt-1">This vehicle has no active recalls on record.</p>
          </div>
        )}
      </div>

      {/* Complaints */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
          <span>📋</span> Consumer Complaints ({complaints.length})
        </h3>
        
        {complaints.length > 0 ? (
          <div className="space-y-3">
            {complaints.slice(0, 10).map((complaint, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-xl border ${
                  complaint.crash 
                    ? 'bg-red-50 border-red-100' 
                    : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  {complaint.crash && (
                    <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                      Crash reported
                    </span>
                  )}
                </div>
                <p className="font-medium text-slate-700 mb-1 text-sm">{complaint.component}</p>
                <p className="text-sm text-slate-600 line-clamp-2">{complaint.summary}</p>
              </div>
            ))}
            {complaints.length > 10 && (
              <p className="text-sm text-slate-500 text-center pt-2">
                + {complaints.length - 10} more complaints
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <span className="text-4xl mb-2 block">👍</span>
            <p className="text-green-600 font-medium">No complaints on file</p>
            <p className="text-sm text-slate-500 mt-1">No consumer complaints have been filed for this vehicle.</p>
          </div>
        )}
      </div>
    </div>
  );
};

