package app.security;

import org.springframework.stereotype.Service;

@Service
public class ParamValidatorImpl implements ParamValidator{

    public ParamValidatorImpl() {
    }

    @Override
    public Boolean validate(String param) {
        String[] splitBySpaces = param.split("\\s+");
        for(String word : splitBySpaces){
            if(word.matches("\\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})\\b"))
                return false;
            if(word.matches("\\b(alter|create|delete|drop|exec(ute){0,1}|insert( +into){0,1}|merge|select|update|union( +all){0,1})\\b"))
                return false;
        }

        return true;
    }
}
