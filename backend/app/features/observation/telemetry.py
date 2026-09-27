from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

def setup_telemetry(app_name: str = "rift-api"):
    provider = TracerProvider()
    
    # In a real setup, configure OTLP endpoint from settings
    otlp_exporter = OTLPSpanExporter(endpoint="localhost:4317", insecure=True)
    span_processor = BatchSpanProcessor(otlp_exporter)
    provider.add_span_processor(span_processor)
    
    trace.set_tracer_provider(provider)
    return trace.get_tracer(app_name)

tracer = setup_telemetry()
