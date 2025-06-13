import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MaintenancePage = ({ message, endTime }) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-20">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center space-y-6">
          <Construction className="w-20 h-20 mx-auto text-orange-500" />
          
          <h1 className="text-3xl font-bold text-orange-500">
            Under Maintenance
          </h1>
          
          <p className="text-xl text-gray-600">
            {message || "We're currently performing scheduled maintenance."}
          </p>
          
          {endTime && (
            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-700">
                Expected to be back:
              </p>
              <p className="text-lg text-gray-600">
                {new Date(endTime).toLocaleString()}
              </p>
            </div>
          )}
          
          <Button
            variant="default"
            size="lg"
            onClick={() => navigate('/auth/login')}
            className="mt-6"
          >
            Administrator Login
          </Button>
          
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenancePage; 